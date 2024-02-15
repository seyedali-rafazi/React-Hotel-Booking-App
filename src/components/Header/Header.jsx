import React, { useRef, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import useOutsideClick from "../../CustomeHooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const navigate = useNavigate();
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
      destination,
      options: JSON.stringify(options),
    });
    //note: => setSearchParams(encodedParams)
    navigate({
      pathname: "/hotels",
      search: encodedParams.toString(),
    });
  };

  return (
    <div className="header">
      <div className="headerSearch">
        <div className="headerSearchItem">
          <MdLocationOn className="headerIcon locationIcon" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            type="text"
            placeholder="Where to go"
            className="headerSearchInput"
            name="destination"
            id="destination"
          />
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <HiCalendar className="headerIcon dateIcon" />
          <div
            id="dateDropDownList"
            onClick={() => setOpenDate(!openDate)}
            className="dateDropDown"
          >
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
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <div id="optionDropDown" onClick={() => setOpenOptions(!openOptions)}>
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
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <button className="headerSearchBtn" onClick={handelSearch}>
            <HiSearch className="headerIcon" />
          </button>
        </div>
      </div>
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
          onChange={(item) => setDate([item.selection])}
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
    <div className="guestOptions" ref={optionsRef}>
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
          <HiMinus className="icon" />
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
