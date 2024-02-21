import { useEffect, useState } from "react";
import styles from "../LocationList/LocationList.module.css";

import { Button, Rating, Pagination } from "@mui/material";

export default function HotelListVertical({ data }) {
  const [selectedCity, setSelectedCity] = useState(null);

  // State variables to manage current page and current records
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRecords, setCurrentRecords] = useState([]);

  const recordsPerPage = 4; // Number of records to display per page
  // Calculate the index of the first and last record for the current page
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // useEffect hook to update currentRecords when data or currentPage changes
  useEffect(() => {
    // Extract the records for the current page from the data
    setCurrentRecords(data.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [data, currentPage, recordsPerPage]);

  // Function to handle page changes
  const handlePageChange = (event, page) => {
    setCurrentPage(page); // Update currentPage when a new page is selected
  };
  const filteredData = selectedCity
    ? data.filter((item) => item.city === selectedCity)
    : currentRecords;

  const lastFilter =
    filteredData !== currentRecords
      ? filteredData.slice(indexOfFirstRecord, indexOfLastRecord)
      : filteredData;
  return (
    <div>
      <HotelPerPage
        setCurrentPage={setCurrentPage}
        setSelectedCity={setSelectedCity}
        lastFilter={lastFilter}
      />
      <div className={styles.pagination}>
        <Pagination
          className={styles.paginationContainer}
          count={Math.ceil(data.length / recordsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          hidePrevButton
          hideNextButton
        />
      </div>{" "}
    </div>
  );
}

function HotelPerPage({ setCurrentPage, setSelectedCity, lastFilter }) {
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <h2>Featured Properties</h2>
      <div className={styles.componyFeatchers}>
        <div className={styles.componyFeatcher}>
          <img
            src="https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png"
            alt="We Price Match"
          />
          <span>We Price Match</span>
        </div>
        <div className={styles.componyFeatcher}>
          <img
            src="https://ak-d.tripcdn.com/images/0AS6o120009gxfriv28B3.png"
            alt="Hotel Booking Guarantee"
          />
          <span>Hotel Booking Guarantee</span>
        </div>
        <div className={styles.componyFeatcher}>
          <img
            src="https://ak-d.tripcdn.com/images/0AS2j120009gxknwsA052.png"
            alt="Hotel Stay Guarantee"
          />
          <span>Hotel Stay Guarantee</span>
        </div>
      </div>
      <div className={styles.avalibaleCitys}>
        <button
          className={styles.button}
          onClick={() => handleCityClick("Amsterdam")}
        >
          Amsterdam
        </button>
        <button
          className={styles.button}
          onClick={() => handleCityClick("London")}
        >
          London
        </button>
        <button
          className={styles.button}
          onClick={() => handleCityClick("Madrid")}
        >
          Madrid
        </button>
      </div>
      <div>
        {lastFilter.map((item) => {
          return (
            <div key={item.id} className={styles.mainHotels}>
              <div className={styles.left}>
                <img src={item.picture_url.url} alt={item.name} />
              </div>

              <div className={styles.mid}>
                <div className={styles.upperMid}>
                  <h2>{item.name}</h2>
                  <div>
                    <Rating
                      name="read-only"
                      value={item.review_scores_value / 2}
                      readOnly
                    />
                  </div>
                  <div className={styles.locationName}>
                    Location: {item.street}
                  </div>
                  <div className="reviews">
                    <span className={styles.rating}>
                      {" "}
                      {Number(item.review_scores_value / 2)} / 5
                    </span>
                    <span className={styles.ratings}>
                      {" "}
                      - {item.total_review} reviwes
                    </span>
                  </div>
                </div>
                <div className={styles.belowMid}>
                  <div>
                    <p>{item.property_type}</p>
                    <span>{item.room_type}</span>
                  </div>
                </div>
              </div>

              <span className={styles.seperator}></span>

              <div className={styles.right}>
                <p>US${item.price}</p>
                <Button style={{ fontWeight: "600" }} variant="contained">
                  Book
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
