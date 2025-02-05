import {useEffect, useState} from "react";

const WialonTracker = () => {
  const [loginStatus, setLoginStatus] = useState("");
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (window.wialon) {
      console.log("Wialon SDK is loaded!");

      // Initialize Wialon session
      const session = window.wialon.core.Session.getInstance();
      session.initSession("https://hst-api.wialon.com", "", "", {force: 1});
      console.log("Session initialized");

      // Login using token (replace with your token if needed)
      session.loginToken(
        "f5870843e01215ce6c07f1619bf78b40C8E8F954C9630B45F91EFC53EC403ED29CA82F82",
        (code) => {
          if (code) {
            console.error("Login failed with code:", code);
            setLoginStatus("Login failed");
          } else {
            console.log("Successfully logged into Wialon");
            setLoginStatus("Login successful");

            // Load the 'itemIcon' library and then update data flags for units
            session.loadLibrary("itemIcon", () => {
              // flags to specify what kind of data should be returned
              const flags =
                window.wialon.item.Item.dataFlag.base |
                window.wialon.item.Unit.dataFlag.lastMessage;

              // Update data flags for avl_unit items
              session.updateDataFlags(
                [{type: "type", data: "avl_unit", flags: flags, mode: 0}],
                (updCode) => {
                  if (updCode) {
                    alert(window.wialon.core.Errors.getErrorText(updCode));
                    return;
                  }
                  // Get loaded 'avl_unit' items
                  const items = session.getItems("avl_unit");
                  if (!items || !items.length) {
                    alert("Units not found");
                    return;
                  }
                  // Map the items to an array of objects containing id and name
                  const unitsData = items.map((item) => ({
                    id: item.getId(),
                    name: item.getName(),
                  }));
                  setUnits(unitsData);
                }
              );
            });
          }
        }
      );
    } else {
      console.error("Wialon SDK not loaded yet");
      setLoginStatus("Wialon SDK not loaded");
    }
  }, []);

  function getUser() {
    const session = window.wialon.core.Session.getInstance();
    var user = session.getCurrUser(); // get current user
    if (!user) alert("You are not logged, click 'login' button");
    else alert("You are logged as '" + user.getName() + "'");
  }

  return (
    <div>
      <h1>{loginStatus}</h1>
      {units.length > 0 ? (
        <div>
          <h2>Units:</h2>
          <ul>
            {units.map((unit) => (
              <li key={unit.id}>
                ID: {unit.id} - Name: {unit.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No units available.</p>
      )}
      <button onClick={getUser}>Get User</button>
    </div>
  );
};

export default WialonTracker;
