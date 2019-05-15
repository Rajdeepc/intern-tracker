export class EnvironmentService {
  ENV = "staging";

  /** API Mode can local, remote */
  API_MODE = "prod";

  ENDPOINTS = {
    local: {
      baseURL: "http://localhost:3000"
    },
    production: {
      baseURL: "https://innovationapp.accenture.com/statustrackerapis"
    }
  };
  /** This property holds the User pool id, client id and API endpoints for local, dev, test, prod environment. */
  APIS = {
    local: {
      allPodcasts: "/myformtech",
      rating: "/rating/"
    },
    production: {
      signup: "/signup",
      addProject: "/addProject",
      getAllProjectLists: "/getAllProjectLists",
      getallUsers: "/getallUsers",
      signin: "/signin",
      addStatus: "/addStatus",
      postprojectdata: "/postprojectdata",
      getprojectdata: "/getprojectdata",
      getallData: "/getallData",
      updatestatus: "/updatestatus",
      deleterecord: "/deleterecord",
      sendemail: "/sendemail",
      getallStatusbyDate: "/getallStatusbyDate",
      taskStartStatus: "/taskStartStatus",
      taskEndStatus: "/taskEndStatus"
    }
  };
}
