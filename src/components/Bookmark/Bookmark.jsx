import { Link } from "react-router-dom";
import "../../App.css";
import { useBookmark } from "../../context/BookMarkListContext";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";
import { HiTrash } from "react-icons/hi";

function Bookmark() {
  const { isLoading, bookmarks, currentBookmark, deleteBookmark } =
    useBookmark();
  if (isLoading) return <Loader />;
  if (!bookmarks.length) return <p>There is no bookmark location</p>;

  const handelDelete = async (e, id) => {
    console.log(id);
    e.preventDefault();
    await deleteBookmark(id);
  };
  return (
    <div>
      <h2>Bookmark List</h2>
      <div className="bookmarkList">
        {bookmarks.map((item) => {
          return (
            <Link
              key={item.id}
              to={`${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            >
              {" "}
              <div
                className={`bookmarkItem ${
                  item.id == currentBookmark?.id ? "current-bookmark" : ""
                }`}
              >
                <div>
                  {" "}
                  <ReactCountryFlag svg countryCode={item.countryCode} />
                  &nbsp; <strong>{item.cityName}</strong>
                  &nbsp; <span>{item.country}</span>
                </div>
                <button onClick={(e) => handelDelete(e, item.id)}>
                  <HiTrash className="trash" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Bookmark;
