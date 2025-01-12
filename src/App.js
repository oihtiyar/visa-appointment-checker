import React, { useState } from 'react';
import './App.css';

function App() {
  const countries = ["Italy", "Germany", "France", "Netherlands", "Denmark"];
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [appointmentMessage, setAppointmentMessage] = useState("Randevu durumu: Henüz kontrol edilmedi.");
  const [isChecking, setIsChecking] = useState(false);

  // API'den randevu bilgilerini almak için fonksiyon
  const checkAppointment = async (country) => {
    setIsChecking(true);
    setAppointmentMessage("Randevular kontrol ediliyor...");
    try {
      const response = await fetch(`https://api.schengenvisaappointments.com/api/visa-list/?country=${country}&format=json`);
      const data = await response.json();
      
      let filteredAppointments = [];
      data.forEach(entry => {
        if (entry.mission_country === country && entry.center_name.includes("Istanbul") && entry.appointment_date !== "null") {
          filteredAppointments.push(`Randevu var: ${entry.appointment_date} - ${entry.center_name}`);
        }
      });

      if (filteredAppointments.length > 0) {
        setAppointmentMessage(filteredAppointments.join("\n"));
      } else {
        setAppointmentMessage("İstanbul için randevu bulunamadı");
      }
    } catch (error) {
      setAppointmentMessage(`API hatası: ${error.message}`);
    }
    setIsChecking(false);
  };

  return (
    <div className="App">
      <h1>Visa Appointment Checker</h1>
      <div className="country-list">
        {countries.map((country) => (
          <button key={country} onClick={() => { setSelectedCountry(country); checkAppointment(country); }}>
            {country}
          </button>
        ))}
      </div>

      {selectedCountry && (
        <div className="appointment-info">
          <h2>Seçilen Ülke: {selectedCountry}</h2>
          <p>{appointmentMessage}</p>
        </div>
      )}

      {isChecking && <p>Randevular kontrol ediliyor...</p>}
    </div>
  );
}

export default App;
