import React, { useEffect, useReducer, useRef, useState } from "react";
import useFetch from "../../CustomeHooks/useFetch";
import styles from "./LocationList.module.css";
import {
  HiArrowRight,
  HiCalendar,
  HiHome,
  HiMinus,
  HiOfficeBuilding,
  HiPaperAirplane,
  HiPlus,
  HiSearch,
  HiUser,
} from "react-icons/hi";

import {
  TextField,
  Button,
  Paper,
  Typography,
  Rating,
  Pagination,
} from "@mui/material";
import useOutsideClick from "../../CustomeHooks/useOutsideClick";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import {
  Navigate,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function LocationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);
  const [fillSearchBar, setFillSearchBar] = useState("");
  const { data, isLoading } = useFetch("http://localhost:5000/hotels", "");
  const locationListMainPhotoUrl = "/photoes/hero-e1fa22fb (1).webp";
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const handelOptions = (name, operator) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operator == "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handelSearch = () => {
    const encodedParams = createSearchParams({
      date: JSON.stringify(date),
      fillSearchBar,
      options: JSON.stringify(options),
    });
    //note: => setSearchParams(encodedParams)
    navigate({
      pathname: "/hotels",
      search: encodedParams.toString(),
    });
  };

  if (isLoading) return <p>loading...</p>;
  return (
    <div>
      <div className={styles.container}>
        <img src={locationListMainPhotoUrl} alt="" />
        <div className={styles.booking}>
          <div className={styles.bookingItems}>
            <TextField
              onClick={() => setOpenSearch(!openSearch)}
              id="outlined-basic"
              label="Search"
              variant="outlined"
              style={{ width: "100%" }}
              value={fillSearchBar}
              onChange={(e) => setFillSearchBar(e.target.value)}
            />
            {openSearch && (
              <DropDownSearch
                setFillSearchBar={setFillSearchBar}
                data={data}
                setOpenSearch={setOpenSearch}
              />
            )}
          </div>
          <div className={styles.bookingItems}>
            <div
              id="dateDropDownList"
              onClick={() => setOpenDate(!openDate)}
              className={styles.dateDropDown}
            >
              <HiCalendar
                style={{ marginRight: "5px" }}
                className={styles.icon}
              />
              {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </div>
            <DateOptionList
              date={date}
              setDate={setDate}
              openDate={openDate}
              setOpenDate={setOpenDate}
            />
          </div>
          <div className={styles.bookingItems}>
            <div
              className={styles.guestOptionsDropDown}
              id="optionDropDown"
              onClick={() => setOpenOptions(!openOptions)}
            >
              <span>
                <HiUser
                  style={{ marginRight: "5px" }}
                  className={styles.icon}
                />
              </span>
              {options.adult} adult &bull; {options.children} children &bull;{" "}
              {options.room} room
            </div>
            {openOptions && (
              <GuestOptionsList
                setOpenOptions={setOpenOptions}
                handelOptions={handelOptions}
                options={options}
              />
            )}
          </div>
          <div className={styles.searchBookingItem}>
            <Button
              style={{
                width: "100%",
                height: "100%",
                fontWeight: "600",
                fontSize: "15px",
                color: "white",
              }}
              onClick={handelSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      <MainWebsite data={data} />
    </div>
  );
}

function DropDownSearch({ setOpenSearch, data, setFillSearchBar }) {
  const optionsRef = useRef();
  const [filteredData, setFilterData] = useState([]);
  useOutsideClick(optionsRef, "outlined-basic", () => {
    setOpenSearch(false);
  });

  const handleItemClick = (city) => {
    setFillSearchBar(city);
    setOpenSearch(false);
  };

  useEffect(() => {
    const filteredData = data.sort((a, b) => {
      return b.review_scores_rating - a.review_scores_rating;
    });
    const sliseData = filteredData.slice(0, 3);
    setFilterData(sliseData);
  }, [data]);
  return (
    <div className={styles.dropDownSearch} ref={optionsRef}>
      <h2>Populer Destinations</h2>
      {filteredData.map((item) => {
        return (
          <div className={styles.populerSearch} key={item.id}>
            <HiUser className={styles.icon} />
            <div
              style={{ width: "100%" }}
              onClick={() => handleItemClick(item.city)}
            >
              <p>{item.city}</p>
              <span>
                {item.country_code} - {item.country}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DateOptionList({ date, setDate, openDate, setOpenDate }) {
  const dateRef = useRef();
  useOutsideClick(dateRef, "dateDropDownList", () => {
    setOpenDate(false);
  });

  return (
    <div className="dateOption" ref={dateRef}>
      {openDate && (
        <DateRange
          onChange={(item) => {
            setDate([item.selection]);
          }}
          ranges={date}
          className="date"
          minDate={new Date()}
          moveRangeOnFirstSelection={true}
        />
      )}
    </div>
  );
}

function GuestOptionsList({ options, handelOptions, setOpenOptions }) {
  const optionsRef = useRef();
  useOutsideClick(optionsRef, "optionDropDown", () => {
    setOpenOptions(false);
  });
  return (
    <div className={styles.guestOptions} ref={optionsRef}>
      <OptionItem
        handelOptions={handelOptions}
        type="adult"
        options={options}
        minLimit={1}
      />
      <OptionItem
        handelOptions={handelOptions}
        type="children"
        options={options}
        minLimit={0}
      />
      <OptionItem
        handelOptions={handelOptions}
        type="room"
        options={options}
        minLimit={1}
      />
    </div>
  );
}

function OptionItem({ options, type, minLimit, handelOptions }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>
      <div className="optionCounter">
        <button
          onClick={() => handelOptions(type, "dec")}
          className="optionCounterBtn"
          disabled={options[type] <= minLimit}
        >
          <HiMinus
            className={`icon ${
              options[type] <= minLimit ? "icon-disable" : ""
            }`}
          />
        </button>
        <span className="optionCounterNumber">{options[type]}</span>
        <button
          onClick={() => handelOptions(type, "inc")}
          className="optionCounterBtn"
        >
          <HiPlus className="icon" />
        </button>
      </div>
    </div>
  );
}

function MainWebsite({ data }) {
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
  console.log(filteredData.length);
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
