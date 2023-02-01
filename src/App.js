import React from "react";
import "./App.css";
import axios from "axios";

let API_KEY = process.env.REACT_APP_LOCATION_KEY;
// console.log("🚀 ~ file: App.js:6 ~ API_KEY", API_KEY); 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      cityData: {},
      mapData: '',
      displayMap: false,
      displayError: false,
      errorMessage: "",
    }
  }

  submitCityHandler = async (event) => {
    event.preventDefault();
    try {
      let url = `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${this.state.city}&format=json`;
      // console.log('URL:', url);

      let cityInfo = await axios.get(url);
      console.log("🚀 ~ file: App.js:27 ~ App ~ submitCityHandler= ~ cityInfo", cityInfo);
      console.log('go keep going');

      this.setState({
        cityData: cityInfo.data[0],
        displayMap: true,
        error: false,
      },
        () => {
          this.getMapData();
        }
      );
    } catch (error) {
      this.setState({
        displayMap: false,
        error: true,
        errorMessage: `an error occured: ${error.response.status}`,
      });
    }
  };


  handleCityInput = (event) => {
    this.setState({
      city: event.target.value,
    });

  };

  getMapData = async () => {
    console.log('did we get state set ?', this.state.lat);
    let mapURL = `https://maps.locationiq.com/v3/staticmap?key=${API_KEY}&center=${this.state.cityData.lat},${this.state.cityData.lon}&size=${window.innerWidth}x300&format=jpg&zoom=12`;

    // console.log("🚀 ~ file: App.js:58 ~ App ~ getMapData= ~ mapURL", mapURL);


    let mapDataResponse = await axios.get(mapURL);
    // control + option then click L 
    // console.log("🚀 ~ file: App.js:62 ~ App ~ getMapData= ~ mapDataResponse", mapDataResponse);

    this.setState({
      mapData: mapDataResponse.config.url,
    });
    // Find weather data!
    this.displayWeather(this.state.cityData.lat, this.state.cityData.lon)
  }
  displayWeather = async (lat, lon, searchQuery) => {
    try {
      console.log('display weather', lat, lon);
      
      let weather = await axios.get(`${process.env.REACT_APP_API_URL}/weather`,
        {
          params: {
            latitude: lat,
            longitude: lon,
            searchQuery: searchQuery
          }
        });
    } catch (error) {
      console.log(error);

    }
  }

  render() {

    Object.entries(this.state.cityData).map(([key, value], index) => {
      return <li key={index}>{value.display_name}</li>
    });
    //  console.log('display map', this.state.displayMap);
    //  console.log('City Data:', this.state.cityData);
    // console.log('Error:', this.state.error);
    // console.log('Error Message:', this.state.errorMessage);


    return (
      <>
        <h1>City Explorer</h1>
        <ul>
          <div>
            {this.state.cityData.display_name}
            {this.state.cityData.lat}
            {this.state.cityData.lon}
            {this.state.displayMap}
          </div>
        </ul>

        <form id="form" onSubmit={this.submitCityHandler}>
          <label>

            {""}
            Pick a City:
            <input type="text" onInput={this.handleCityInput} />
          </label>
          <button type="submit">Explore!!</button>
        </form>

        {
          this.state.mapData &&
          <img src={this.state.mapData} alt={this.state.city} />
        }
      </>
    );

  }
}


export default App;





