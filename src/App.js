import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat, getInitialMode } from "./util";

function addCommas(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

const MenuProps = {
  variant: "menu",
  getContentAnchorEl: null,
};

export const sortData = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
};

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [darkMode, setDarkMode] = useState(getInitialMode());

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({ name: country.country, value: country.countryInfo.iso2 }));
          setCountries(countries);
          setMapCountries(data);

          const sortedTableData = data;
          sortedTableData.sort((a, b) => {
            if (a.cases > b.cases) {
              return -1;
            } else {
              return 1;
            }
          });

          setTableData(sortedTableData);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(darkMode));
  }, [darkMode]);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    if (countryCode === "worldwide") {
      setCenter({ lat: 34.80746, lng: -40.4796 });
    }
    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        setMapZoom(4);
      });
  };

  return (
    <div className={`app ${darkMode && "app_dark"}`}>
      <div className="app__left">
        <div className="app__header">
          <h1 style={{ display: "inline" }}>
            COVID-19 TRACKER
            <img
              className="corona__logo"
              src="https://res.cloudinary.com/shatadrucld/image/upload/v1600883043/icons8-coronavirus-50_acttgr.png"
            />{" "}
          </h1>

          <div className="toggle">
            <span style={{ color: darkMode ? "gray" : "#cf7500", marginRight: "6px", width: "20px" }}>☀</span>
            <label className="switch">
              <input
                checked={darkMode}
                type="checkbox"
                onChange={() => {
                  setDarkMode((prevState) => !prevState);
                }}
              />
              <span className="slider round"></span>
            </label>
            <span style={{ color: darkMode ? "slateblue" : "gray", marginLeft: "6px" }}>☾</span>
          </div>
          <FormControl className={`app__dropdown ${darkMode && "app-dropdown-dark"}`}>
            <Select variant="outlined" onChange={onCountryChange} value={country} MenuProps={MenuProps}>
              <MenuItem value="worldwide">
                <span className={darkMode && "drp-dark"}>Worldwide</span>
              </MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            dark={darkMode}
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            dark={darkMode}
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            dark={darkMode}
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          ></InfoBox>
        </div>
        <Map dark={darkMode} countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType} />
      </div>
      <Card className={`app__right ${darkMode && "app-right-dark"}`}>
        <CardContent>
          <h3>Total cases by country</h3>
          <Table dark={darkMode} countries={tableData}></Table>
          <h3 style={{ marginTop: "30px", marginBottom: "12px" }}>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
