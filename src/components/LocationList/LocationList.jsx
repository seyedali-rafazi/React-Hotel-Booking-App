import React, { useRef, useState } from "react";
import useFetch from "../../CustomeHooks/useFetch";
import styles from "./LocationList.module.css";
import { HiCalendar, HiOfficeBuilding, HiSearch, HiUser } from "react-icons/hi";

import { TextField, Button, Paper, Typography } from "@mui/material";
import useOutsideClick from "../../CustomeHooks/useOutsideClick";

export default function LocationList() {
  const [openOptions, setOpenOptions] = useState(false);

  const { data, isLoading } = useFetch("http://localhost:5000/hotels", "");
  const locationListMainPhotoUrl = "/photoes/hero-e1fa22fb (1).webp";

  if (isLoading) return <p>loading...</p>;
  return (
    <div>
      <div className={styles.container}>
        <img src={locationListMainPhotoUrl} alt="" />
        <div className={styles.booking}>
          <div className={styles.bookingItems}>
            <TextField
              onClick={() => setOpenOptions(!openOptions)}
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              style={{ width: "100%" }}
            />
            {openOptions && <DropDownSearch setOpenOptions={setOpenOptions}/>}
          </div>
          <div className={styles.bookingItems}>
            <HiCalendar className={styles.icon} />
            <p>Sun 18 Feb - Wed 20 Mar</p>
          </div>
          <div className={styles.bookingItems}>
            <HiUser className={styles.icon} />
            <p>2 Adults &bull; 0 Children &bull; 1 Room</p>
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
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="nearbyLocation">
        <h2>Nearby Locations</h2>
        <div className="locationList">
          {data.map((item) => {
            return (
              <div className="locationItem" key={item.id}>
                <img src={item.picture_url.url} alt={item.name} />
                <div className="locationItemDesc">
                  <p className="location">{item.smart_location}</p>
                  <p className="name">{item.name}</p>
                  <p className="price">
                    $&nbsp;{item.price}&nbsp;<span>night</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DropDownSearch({setOpenOptions}) {
  const optionsRef = useRef();
  useOutsideClick(optionsRef, "outlined-basic", () => {
    setOpenOptions(false);
  });
  return (
    <div className={styles.dropDownSearch} ref={optionsRef}>
      <h2>Populer Search</h2>
      <h2>Populer Search</h2>
      <h2>Populer Search</h2>
      <h2>Populer Search</h2>
    </div>
  );
}
