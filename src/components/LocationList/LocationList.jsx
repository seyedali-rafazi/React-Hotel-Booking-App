import React, { useEffect, useReducer, useRef, useState } from "react";
import useFetch from "../../CustomeHooks/useFetch";
import styles from "./LocationList.module.css";
import { HiCalendar, HiMinus, HiPlus, HiUser } from "react-icons/hi";
import { TextField, Button } from "@mui/material";
import useOutsideClick from "../../CustomeHooks/useOutsideClick";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import HotelListVertical from "../HotelListVertival/HotelListVertical";

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

      <HotelListVertical data={data} />
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
