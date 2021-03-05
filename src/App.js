import React, { useState, useEffect } from 'react';
import { Dimmer, Loader, Select, Card } from 'semantic-ui-react';
import Chart from 'react-apexcharts';
import './App.css';

const options = [
  {value: 'USD', tect: 'USD'}, 
  {value: 'EUR', text: 'EUR'}, 
  {value: 'GBP', text: 'GBP'}
];

function App() {
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [chartData, setChartData] = useState(null);
  const [series, setSeries] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await res.json();
      setPriceData(data.bpi);
      getChartData();
    }
    fetchData();
  }, []);

  const handleSelect = (e, data) => {
    setCurrency(data.value);
  };

  const getChartData = async () => {
    const res = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
    const data = await res.json();
    const categories = Object.keys(data.bpi);
    const series = Object.values(data.bpi);
    setChartData({
      xaxis: {
        categories: categories
      }
    })

    setSeries([
      {
        name: 'Bitcoin Price',
        data: series
      }
    ])

    setLoading(false);
  }

  return (
    <div className="App">
      <div className='nav' style={{ padding: 15, backgroundColor: 'gold' }}>
        Coindesk API Data
      </div>
      {
        loading ? (
          <div>
            <Dimmer active inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          </div>
        ) : (
          <>
            <div className='price-container' 
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '600',
              height: '300',
              margin: '0 auto'
            }}>
              <div className='form'> 
                <Select 
                  placeholder='Select your currency' 
                  onChange={handleSelect}
                  options={options}
                ></Select>
              </div>
              <div className='price'>
                <Card>
                  <Card.Content>
                    <Card.header>{currency} Currency</Card.header>
                    <Card.Description>{priceData[currency].rate}</Card.Description>
                  </Card.Content>
                </Card>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Chart options={chartData}
                  series={series}
                  type='line'
                  width='1200'
                  height='300'
              ></Chart>
            </div>
          </>
        )}
    </div>
  );
}

export default App;
