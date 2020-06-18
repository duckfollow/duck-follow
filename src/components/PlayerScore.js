import React from 'react';
import {Bar} from 'react-chartjs-2';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';

export default class PlayerScore extends React.Component {

    render() {
        const dataBar = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
              {
                label: 'Player Score',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [65, 59, 80, 81, 56, 55, 40]
              }
            ]
          };

          const legendOpts = {
            display: true,
            position: 'bottom',
            fullWidth: true,
            reverse: false,
            labels: {
              fontColor: '#000000'
            }
          };

          const options = {
            maintainAspectRatio: false,
            bezierCurve: false,
            scales: {
                xAxes: [{
                    ticks: { display: true },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    ticks: { display: true },
                    gridLines: {
                        display: true,
                        drawBorder: false
                    }
                }]
            }
          };
        return (
            <div>
                <Card>
                        <CardBody>
                        <Bar
                            data={dataBar}
                            width={100}
                            height={300}
                            legend={legendOpts} options={options}/>
                        </CardBody>
                   </Card>
            </div>
        )
    }
}