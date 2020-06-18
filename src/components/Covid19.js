import React from 'react';
import './Covid19.css';
import { Container, Row, Col } from 'reactstrap';
import {Line} from 'react-chartjs-2';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
export default class Covid19 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateAll: [],
            confirmedAll: [],
            deathsAll: [],
            recoveredAll: [],
            date: [],
            confirmed: [],
            deaths: [],
            recovered: [],
            lastDate: '',
            lastConfirmed: 0,
            lastDeaths: 0,
            lastRecovered: 0,
            isHidden: true
        }

        this.onSwitchChange = this.onSwitchChange.bind(this)
    }

    componentDidMount() {
        let dateCovid = [];
        let dataConfirmed = [];
        let dataRecovered = [];
        let dataDeaths = [];
        let dateCovidAll = [];
        let dataConfirmedAll = [];
        let dataRecoveredAll = [];
        let dataDeathsAll = [];
        let sumConfirmed = {};
        let sumRecovered = {};
        let sumDeaths = {}  
        fetch("https://pomber.github.io/covid19/timeseries.json")
            .then(response => response.json())
            .then(data => {
                // data["Thailand"].forEach(({ date, confirmed, recovered, deaths }) => {
                //         // console.log(`${date} active cases: ${confirmed - recovered - deaths}`);
                //         var d = date.split("-");
                //         var dd = d[2]+"/"+d[1]+"/"+d[0]
                //         dateCovid.push(date);
                //         dataConfirmed.push(confirmed);
                //         dataRecovered.push(recovered);
                //         dataDeaths.push(deaths);
                //     }  
                // );
                for (const property in data) {
                    //console.log(`${property}: ${data[property]}`);
                    data[property].forEach(({ date, confirmed, recovered, deaths }) => {
                        // console.log(`${date} active cases: ${confirmed - recovered - deaths}`);
                        var d = date.split("-");
                        var dd = d[2]+"/"+d[1]+"/"+d[0]
                        // dateCovidAll.push(dd);
                        // dataConfirmedAll.push(confirmed);
                        // dataRecoveredAll.push(recovered);
                        // dataDeathsAll.push(deaths);
                        try {
                            if (typeof sumConfirmed[dd] != 'undefined') {
                                sumConfirmed[dd] = sumConfirmed[dd] + confirmed
                                sumRecovered[dd] = sumRecovered[dd] + recovered
                                sumDeaths[dd] = sumDeaths[dd] + deaths
                            } else {
                                sumConfirmed[dd] =  confirmed
                                sumRecovered[dd] = recovered
                                sumDeaths[dd] = deaths
                            }
                        }catch(err) {

                        }
                        
                        if (property == "Thailand") {
                            dateCovid.push(dd);
                            dataConfirmed.push(confirmed);
                            dataRecovered.push(recovered);
                            dataDeaths.push(deaths);
                        }
                    });
                }

                for (const key in sumConfirmed) {
                    // console.log(key+":"+sumConfirmed[key])
                    dataConfirmedAll.push(sumConfirmed[key])
                    dataRecoveredAll.push(sumRecovered[key])
                    dataDeathsAll.push(sumDeaths[key])
                }

                this.setState({
                    dateAll: dateCovidAll,
                    confirmedAll: dataConfirmedAll,
                    recoveredAll: dataRecoveredAll,
                    deathsAll: dataDeathsAll,
                    date: dateCovid,
                    confirmed: dataConfirmed,
                    recovered: dataRecovered,
                    deaths: dataDeaths,
                    lastDate: dateCovid[dateCovid.length-1],
                    lastConfirmed: dataConfirmed[dataConfirmed.length-1],
                    lastDeaths: dataDeaths[dataDeaths.length-1],
                    lastRecovered: dataRecovered[dataRecovered.length-1]
                })   
            });
    }

    onSwitchChange(event) {
        this.setState({ isHidden: !this.state.isHidden });
    }

    render() {
        const dataLine = {
            labels: this.state.date,
            datasets: [
              {
                label: 'ผู้ติดเชื้อ',
                fill: false,
                hidden: !this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#EEEE14',
                borderColor: '#EEEE14',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#EEEE14',
                pointBackgroundColor: '#EEEE14',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#EEEE14',
                pointHoverBorderColor: '#EEEE14',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.state.confirmed
              },
              {
                label: 'หายแล้ว',
                fill: false,
                hidden: !this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#10F244',
                borderColor: '#10F244',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#10F244',
                pointBackgroundColor: '#10F244',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#10F244',
                pointHoverBorderColor: '#10F244',
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: this.state.recovered
              },
              {
                label: 'เสียชีวิต',
                fill: false,
                hidden: !this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#FF3349',
                borderColor: '#FF3349',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#FF3349',
                pointBackgroundColor: '#FF3349',
                pointBorderWidth: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FF3349',
                pointHoverBorderColor: '#FF3349',
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: this.state.deaths
              },
              {
                label: 'ผู้ติดเชื้อทั้งหมด',
                fill: false,
                hidden: this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#FF5733',
                borderColor: '#FF5733',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#FF5733',
                pointBackgroundColor: '#FF5733',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#FF5733',
                pointHoverBorderColor: '#FF5733',
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: this.state.confirmedAll
              },
              {
                label: 'หายแล้วทั้งหมด',
                fill: false,
                hidden: this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#3498DB',
                borderColor: '#3498DB',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#3498DB',
                pointBackgroundColor: '#3498DB',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#3498DB',
                pointHoverBorderColor: '#3498DB',
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: this.state.recoveredAll
              },
              {
                label: 'เสียชีวิตทั้งหมด',
                fill: false,
                hidden: this.state.isHidden,
                lineTension: 0,
                backgroundColor: '#5B2C6F',
                borderColor: '#5B2C6F',
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'round',
                pointBorderColor: '#5B2C6F',
                pointBackgroundColor: '#5B2C6F',
                pointBorderWidth: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#5B2C6F',
                pointHoverBorderColor: '#5B2C6F',
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: this.state.deathsAll
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
            bezierCurve: false,
            scales: {
                xAxes: [{
                    ticks: { display: false },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    ticks: { display: false },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            }
          };
        return (
            <Container fluid={true}>
                <Row>
                    <Col md="6">
                        <h3>อัพเดตตัวเลขผู้ติดเชื้อ COVID-19 ในประเทศไทย</h3>
                        <p className="text-last-update">วันที่อัพเดพล่าสุด {this.state.lastDate}</p>
                        <div className="switch-center">
                            <label class="switch">
                                <input type="checkbox" defaultChecked={!this.state.isHidden} onChange={this.onSwitchChange}/>
                                <span class="slider round"></span>
                            </label>
                            <label className="text-switch">ข้อมูลทั่วโลก</label>
                        </div>
                        <Line data={dataLine} legend={legendOpts} options={options} />
                        <br/>
                        <Row>
                            <Col xs="4" className="padding-right0">
                                <Card>
                                    <CardBody className="card-padding-covid">
                                    <CardTitle className="card-title-covid">ผู้ติดเชื้อ</CardTitle>
                                    <CardSubtitle>{this.state.lastConfirmed}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs="4" className="padding-right0">
                                <Card>
                                    <CardBody className="card-padding-covid">
                                    <CardTitle className="card-title-covid">หายแล้ว</CardTitle>
                                    <CardSubtitle>{this.state.lastRecovered}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs="4">
                                <Card>
                                    <CardBody className="card-padding-covid">
                                    <CardTitle className="card-title-covid">เสียชีวิต</CardTitle>
                                    <CardSubtitle>{this.state.lastDeaths}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="6" className="p-center">
                        <p>
                            "หมีไซเบอร์ร่วมเป็นส่วนหนึ่งในการส่งกำลังใจ ให้กับแพทย์ พยายาลให้มีกำลังใจการทำงาน และขอให้ประเทศผ่านวิกิตครั้งนี้ไปได้ด้วยดีนะครับ"
                        </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}