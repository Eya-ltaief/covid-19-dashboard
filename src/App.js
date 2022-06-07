import React, {useState, useEffect} from "react"

import {FormControl, Select,MenuItem, Card, CardContent} from "@material-ui/core"

import InfoBox from "./compnents/InfoBox/InfoBox";
import Table from "./compnents/Table/Table";
import LineGraph from "./compnents/LineGraph";
import{ sortData, prettyPrintStat }  from "./compnents/utils";
import './App.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});


  const onCountryChange= async (e)=>{

    const countryCode = e.target.value;    
    const url = countryCode=== "worldwide"? "https://disease.sh/v3/covid-19/all": `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
          .then((res)=>res.json())
          .then((data)=>{setCountryInfo(data)
          
            setCountry(countryCode)
          })
  }

  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/all")
      .then((res)=>res.json())
      .then((data)=>{
        setCountryInfo(data)
      })
    
  }, []);
  
  useEffect(() => {
  //async => send a request to a server , wait for it, then dosth with the import
  const getCountriesData = async()=>{
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((res)=>res.json())
    .then((data)=>{
      const countries = data.map((country)=>({
        name: country.country,
        value : country.countryInfo.iso2
      }))
      let sortedData = sortData(data);
      setCountries(countries)
      setTableData(sortedData);
    })
  }
  getCountriesData()
  }, []);

  return (
    <div className="app">
       <div className='app__left'>
            <div className='app__header'>   
              <h2>COVID_19 TRACKER</h2>
                <FormControl>
                    <Select labelId="demo-simple-select-label"id="demo-simple-select" variant='outlined' value={country} onChange={onCountryChange}>
                      <MenuItem value="Worldwide">{country}</MenuItem>
                      {countries.map(country=>(
                          <MenuItem value={country.value}>{country.name}</MenuItem>
                      ))}
                    </Select>
                </FormControl>
            </div>
            <div className="app__stats">
              <InfoBox title="Coronavirus cases"   onClick={(e) => setCasesType("cases")}  isRed active={casesType === "cases"} cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases}  />
              <InfoBox title="Recovered"   onClick={(e) => setCasesType("cases")}  active={casesType === "recovered"} cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />
              <InfoBox title="Deaths"   onClick={(e) => setCasesType("cases")}  isRed active={casesType === "deaths"}cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths} />
            </div>
          <br />
          <br />              
          <LineGraph casesType={casesType}/>
       </div>
       <Card className="app__right">
            <CardContent>
              <div className="app__information">
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />
                <h3>Worldwide new </h3>
              </div>
            </CardContent>
        </Card>
      </div>
  );
}

export default App;
