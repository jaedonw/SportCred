import React, { useState } from "react";
import { Component, useEffect } from "react";
import "./App.css";
import "./TriviaStyling.css";
import "./analyze.css";
import logo from "./logo.svg";
import { NavLink, Switch, Route } from "react-router-dom";
import EditProfile from "./EditProfile";
import PickPage from "./components/PickPage";
import SoloTrivia from "./components/SoloTrivia";
import OnlinePostTrivia from "./components/OnlinePostTrivia";
import OnlineChallengeTrivia from "./components/OnlineChallengeTrivia";
import DebatePage from './components/DebatePage'
import TheZone from "./TheZone"
import Latest from "./Latest"
import axios from "axios";
import LoggedOut from "./LoggedOut";

function App() {
  const [clicked, setClicked] = useState(0)
  const [weeklyPosts, setWeeklyPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // WIN / LOSE COLOURS
  const winColor = "#00ff00";
  const loseColor = "#ca0000";
  // TEAM COLOURS
  var myMap = new Map();
  myMap.set("LAC", "#004edf");
  myMap.set("ATL", "#fd4800");
  myMap.set("LAL", "#af01ff");
  myMap.set("CHA", "#00ffaa");
  myMap.set("TOR", "red");
  myMap.set("MIL", "#0c3a10");
  myMap.set("PHX", "#de3aff");
  myMap.set("GSW", "#ffe600");
  myMap.set("BKN", "#b8b7b2");
  myMap.set("HOU", "#640000");
  myMap.set("BOS", "#07a50f");
  myMap.set("NOR", "#645500");
  myMap.set("DEN", "yellow");
  myMap.set("CHI", "#ff3d3d");
  myMap.set("MEM", "#1f436d");
  myMap.set("MIN", "blue");
  myMap.set("NYK", "#ff7300");
  myMap.set("WAS", "#2600ff");
  myMap.set("MIA", "#ff00b3");
  myMap.set("IND", "#bde700");
  myMap.set("SAC", "#67317c");
  myMap.set("SAS", "#3c383d");
  myMap.set("UTH", "#afa122");
  myMap.set("POR", "#b30000");
  myMap.set("CLE", "#882525")
  myMap.set("PHI", "#00a2ff");
  myMap.set("OKC", "#ffd900");
  myMap.set("ORL", "#009ee7");
  myMap.set("DAL", "#01a2ff");
  myMap.set("DET", "#333131");

  const colourTeam = (team) => {
    return myMap.get(team);
  };


  const colourTeamScore = (score1, score2) => {
    if (score1 > score2) return winColor;
    if (score1 < score2) return loseColor;
  };

  useEffect(() => {
    if (clicked === 1) {
      sessionStorage.setItem('needToLogout', true)
      window.location.reload(false);
    }
  })

  useEffect(() => {
    const url = "http://localhost:8080/api/v1/getACSScore";
    const headers = {
      "Content-Type": "text/plain",
    };

    axios
      .post(
        url,
        { username: btoa(sessionStorage.getItem("username")) },
        { headers }
      )
      .then((res) => {
        // console.log(res.data);

        let acsscore = res.data.ACS;
        let acsrank = res.data.rank;
        sessionStorage.setItem('acsscore', acsscore)
        sessionStorage.setItem('acsrank', acsrank)
        sessionStorage.setItem('numOnlinePlayed', 0)

        setRefresh(true)
      })
    })

    useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/v1/getWeeklyGames");
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status < 400) {
        console.log(xhr.status);
        console.log(xhr.response.data);
        console.log("hi");
        for (var i = 0; i < xhr.response.data.length; i++) {
          // console.log(xhr.response.data[i].home_team_score);
          setWeeklyPosts(posts => [...posts,
          {
            id: xhr.response.data[i].id,
            homeScore: xhr.response.data[i].home_team_score,
            awayScore: xhr.response.data[i].visitor_team_score,
            homeTeam: xhr.response.data[i].home_team.abbreviation,
            awayTeam: xhr.response.data[i].visitor_team.abbreviation,
          }
          ]);
        }
      } else {
        //console.log("400 Error Status");
      }
    };
    xhr.onerror = () => {
      //console.log("oops");
    };
    xhr.send(
      JSON.stringify({})
    );
  }, [])


  const [profilePicture, setProfilePicture] = useState("");
  var avatar;

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    setProfilePicture(xhr.responseText);
  });
  xhr.open("POST", "http://localhost:8080/api/v1/getProfilePicture", true);

  xhr.send(
    JSON.stringify({ username: btoa(sessionStorage.getItem("username")) })
  );

  switch (profilePicture) {
    case "./lebron.jpg":
      avatar = require("./lebron.jpg");
      break;
    case "./michaeljordan.jpg":
      avatar = require("./michaeljordan.jpg");
      break;
    case "./kobe.jpg":
      avatar = require("./kobe.jpg");
      break;
    default:
  }

  const addSeparate = (total, idx) => {
    if (total.length > idx + 1) return ",";
  }

  return (
    <div className="AppPage">
      { sessionStorage.getItem('needToLogout') ? (
        <LoggedOut />
      ) : (
          <div className="App">
            <header>
              <img src={logo} className="logo" alt="logo" />
              <div class="container">
                <div class="ticker">
                  <marquee direction="left" scrollamount="7">
                    <span className="hello">FINAL GAME UPDATES:</span> {" "}
                    {weeklyPosts.map((weeklyPost, index) => (
                      <span> 
                        <span style={{ color: colourTeamScore(weeklyPost.homeScore, weeklyPost.awayScore) }}> {`${weeklyPost.homeTeam}`}</span>
                        <span style={{ color: "black" }}> {`${weeklyPost.homeScore} `}</span> -
                        <span style={{ color: "black" }}> {`${weeklyPost.awayScore} `}</span>
                        <span style={{ color: colourTeamScore(weeklyPost.awayScore, weeklyPost.homeScore) }}> {`${weeklyPost.awayTeam}`}</span>
                        <span>{addSeparate(weeklyPosts, index)}</span>
                      </span>
                    ))}
                  </marquee>
                </div>
                <nav>
                  <ul>
                    <li>
                      <NavLink exact activeClassName="current" to="/">
                        Z
                      </NavLink>
                    </li>
                    <li>
                      <NavLink exact activeClassName="current" to="/live">
                        LIVE
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>
            <div class="verbar">
              <div class="profile">
                <h2>
                  Welcome, <b>{sessionStorage.getItem("username")}</b>
                </h2>
                <p>
                  <img src={avatar} className="lebron" alt="User Avatar" /> ACS:{" "}
                  {sessionStorage.getItem("acsscore")}
                </p>
                <p>
                  <b>{sessionStorage.getItem("acsrank")}</b>
                </p>
                <hr class="new1"></hr>
              </div>
              <div class="sidebar">
                <ul>
                  <li>
                    <NavLink exact activeClassName="current" to="/my-account">
                      MY ACCOUNT
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/the-zone">
                      THE ZONE
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/trivia">
                      TRIVIA
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/picks">
                      PICKS
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/analyze">
                      ANALYZE
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/latest">
                      LATEST
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact activeClassName="current" to="/" onClick={() => { setClicked(1) }}>
                      LOG OUT
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <Main />
          </div>
        )}
    </div>
  );
}

const MyAccount = () => (
  <div className="my-account">
    <EditProfile />
  </div>
);

// ----------------------------- ALL TRIVIA RELATED SECTIONS BELOW -----------------------------
const Trivia = () => (
  <div className="trivia">
    <h1>Trivia</h1>
    {/* <div className="horizontal-line"></div> */}
    <h2>Select a mode to play.</h2>
    <p>
      <NavLink exact to="/trivia/solo">
        Solos
      </NavLink>
    </p>
    <p>
      <NavLink exact to="/trivia/online">
        Head to Head
      </NavLink>
    </p>
  </div>
);

const Solo = () => (
  <div className="solo">
    <h1>Solo Trivia</h1>
    {/* <div className="horizontal-line"></div> */}
    <div className="solo-info">
      <p>Play a 10 question trivia game to earn ACS points!</p>
      <p>You have 14 seconds to answer each question.</p>
      <p>
        Correct answers earn 1 ACS point and incorrect answers lose 1 ACS point.
      </p>
      <p>Good Luck!</p>
    </div>
    <div className="solo-play">
      <p>
        <NavLink exact to="/trivia/solo/solo-game">
          Start!
        </NavLink>
      </p>
    </div>
    <div className="back">
      <p>
        <NavLink exact to="/trivia">
          back
        </NavLink>
      </p>
    </div>
  </div>
);

class SoloGame extends Component {
  render() {
    return (
      <div className="TriviaQuestion">
        <h1>Solo Trivia</h1>
        {/* <div className="horizontal-line"></div> */}
        <SoloTrivia />
      </div>
    );
  }
}

const HeadToHead = () => (
  <div className="head_to_head">
    <h1>Head to Head Trivia</h1>
    {/* <div className="horizontal-line"></div> */}
    <div className="online-info">
      <p>
        Challenge someone's trivia score or post your own for others to
        play against!
      </p>
      <p>
        There are 10 questions each game and you have 10 seconds to answer each
        one.
      </p>
      <p>A win earns 2 ACS points, but a loss deducts 2 ACS points.</p>
      <p>
        <br></br>So what's it gonna be?<br></br>
      </p>
      <div className="online-post">
        <p>
          <NavLink exact to="/trivia/online/online-post">
            Post Your Own Score
          </NavLink>
        </p>
      </div>
      <div className="online-challenge">
        <p>
          <NavLink exact to="/trivia/online/online-challenge">
            Challenge Someone's Score
          </NavLink>
        </p>
      </div>
      <div className="back">
        <p>
          <NavLink exact to="/trivia">
            back
          </NavLink>
        </p>
      </div>
    </div>
  </div>
);

class OnlinePost extends Component {
  render() {
    return (
      <div className="OnlinePostQuestions">
        <h1>Online Trivia</h1>
        {/* <div className="horizontal-line"></div> */}
        <OnlinePostTrivia />
      </div>
    );
  }
}

class OnlineChallenge extends Component {
  render() {
    return (
      <div className="OnlineChallengeTrivia">
        <h1>Online Trivia</h1>
        {/* <div className="horizontal-line"></div> */}
        <OnlineChallengeTrivia />
      </div>
    );
  }
}

// ------------------------- ALL TRIVIA RELATED SECTIONS END HERE --------------------------------

const Picks = () => (
  <div className="picks">
    <PickPage />
  </div>
);

const Zone = () => (
  <div className="the-zone">
    <TheZone />
  </div>
);

const Analyze = () => (
  <div className="analyze">
    <div className="analyze-header"><h1>Analyze and Debate</h1></div>
    <DebatePage />
  </div>
);

const Live = () => (
  <div className="live">
    <h1>coming soon...</h1>
  </div>
);
const TheLatest = () => (
  <div className="latest">
    <Latest />
  </div>
);

const Main = () => (
  <Switch>
    <Route exact path="/" component={Zone}></Route>
    <Route exact path="/my-account" component={MyAccount}></Route>
    <Route exact path="/the-zone" component={Zone}></Route>
    <Route exact path='/trivia' component={Trivia}></Route>
    <Route exact path='/trivia/solo' component={Solo}></Route>
    <Route exact path='/trivia/solo/solo-game' component={SoloGame}></Route>
    <Route exact path='/trivia/online' component={HeadToHead}></Route>
    <Route exact path='/trivia/online/online-post' component={OnlinePost}></Route>
    <Route exact path='/trivia/online/online-challenge' component={OnlineChallenge}></Route>
    <Route exact path="/picks" component={Picks}></Route>
    <Route exact path="/analyze" component={Analyze}></Route>
    <Route exact path="/live" component={Live}></Route>
    <Route exact path="/latest" component={TheLatest}></Route>
  </Switch>
);

export default App;