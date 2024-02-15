import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useHotel } from "../../context/HotelProvide";

function Hotels() {
  const { isLoading, hotels, currentHotel } = useHotel();
  if (isLoading) return <Loader />;
  return (
    <div className="searchList">
      <h2>Search Result ({hotels.length})</h2>
      {hotels.map((item) => {
        return (
          <Link
            key={item.id}
            to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
          >
            <div
              className={`searchItem ${
                item.id == currentHotel?.id ? "current-hotel" : ""
              }  `}
            >
              <img src={item.picture_url.url} alt={item.name} />
              <div className="searchItemDesc">
                <p className="location">{item.smart_location}</p>
                <p className="name">{item.name}</p>
                <p className="price">$&nbsp;{item.price}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Hotels;
