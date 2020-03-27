import React from 'react';
import './Policy.css';
import { Badge } from 'reactstrap';
import shield from '../assets/img/shield.svg'

export default class Policy extends React.Component {
    render() {
        return (
            <div>
                <section>
                    <div className="App-content">
                        <img src={shield} className="img-protect"/>
                        <br/>
                        <h1>Policy <Badge color="secondary">privacy</Badge></h1>
                        <p className="txt-policy-size">นโยบายความเป็นความตัวของเรา</p>
                    </div>
                </section>
                <section>
                    <div className="Policy-content">
                        <h3>เมื่อคุณใช้บริการของเรา คุณไว้วางใจให้เรารักษาข้อมูลของคุณ เราเข้าใจว่านี่คือความรับผิดชอบที่ยิ่งใหญ่ และพยายามอย่างยิ่งที่จะปกป้องข้อมูลของคุณ รวมถึงมอบอำนาจในการควบคุมข้อมูลให้แก่คุณ</h3>
                        <br/>
                        <p>นโยบายความเป็นส่วนตัวนี้มีไว้เพื่อช่วยให้คุณทราบประเภทข้อมูลที่เรารวบรวม เหตุผลที่เรารวบรวม รวมถึงวิธีที่คุณจะอัปเดตข้อมูลดังกล่าว</p>
                    </div>
                </section>
                <section>
                    <div className="Policy-content">
                        <p>เราสร้างบริการหลายอย่างที่ช่วยให้ผู้คนหลายล้านคนสำรวจและโต้ตอบกับโลกด้วยวิธีใหม่ๆ ได้ในทุกๆ วัน บริการของเรามีดังนี้</p>
                        <ul>
                            <li>พัฒนาโมบายแอปพลิเคชัน</li>
                            <li>พัฒนาเว็บไซต์</li>
                        </ul>
                        <br/>
                        <p>เรารวบข้อมูลต่างๆ เพื่อนำมาใช้ในการปรับปรุงแอปพลิเคชัน เพื่อให้ผู้ใช้งานมีประสบการณ์ใช้งานที่ดีต่อแอปพลิเคชัน และเราจะให้ความสำคัญต่อการใช้งานเป็นหลัก และการปกป้องข้อมูล ความเป็นส่วนตัวของผู้ใช้งาน และอาจจะมีการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวตามความเหมาะสม</p>
                    </div>
                </section>
                <section>
                    <div className="Policy-content">
                        <h1>บริการบางอย่างของเรา</h1>
                        <p>ประกาศเกี่ยวกับนโยบายความเป็นส่วนตัวต่อไปนี้มีข้อมูลเพิ่มเติมเกี่ยวกับบริการบางอย่างของเรา</p>
                        <ul>
                            <li><a href="https://play.google.com/store/apps/details?id=com.prasit.theboxshop" target="_blank">the box shop เปิดร้านค้าออนไลน์</a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=me.duckfollow.ozone" target="_blank">ozone not included ตรวจระดับฝุ่น PM 2.5</a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=com.prasit.shopmanager" target="_blank">krap krap จัดการร้านค้า</a></li>
                            <li><a href="https://play.google.com/store/apps/details?id=me.duckfollow.qrcode" target="_blank">แสกน QR Code</a></li>
                        </ul>
                    </div>
                </section>
            </div>
        );
      }
}