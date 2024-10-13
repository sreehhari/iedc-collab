import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Firebase/Auth/Auth";
import {
  getDevelopers,
  getProjects,
  getRequests,
  getRequestsRecieved,
  getUser,
  getTags,
  getSkills,
} from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getJobsOrg } from "../Firebase/firebase";
export const ProjectContext = React.createContext();

export const ProjectProvider = ({ children }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [allProjects, setAllProjects] = useState([]);
  const [developers, setDevelopers] = useState(null);
  const [jobs, setJobs] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState();
  const [profile, setProfile] = useState(null);
  const [allDevelopers, setAllDevelopers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [requestsRecieved, setRequestsRecieved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [devHash, setDevHash] = useState({});
  const [skills, setSkills] = useState([]);
  const [tags, setTags] = useState([]);
  const [myJobs, setMyJobs] = React.useState([]);
  const [companyDetails, setCompanyDetails] = useState({
    // name: profile?.name || "",
    description: "",
    // company_logo: profile?.profilePhoto || "",
    // role: profile?.role ? profile.role : "Organization",
    website: "",
    address: "",
    // phone: profile?.contact || "",
    // github: "",
    linkedin: "",
    // email: profile?.email || "",
    district: "",
    state: "",
    approved: false,
    deleted: false,
  });
  const fetchData = (state) => {
    let index = 0;
    switch (state) {
      case "ADD":
        index = allProjects.length;
        break;
      case "EDIT":
        index = allProjects.indexOf(selectedProject);
        break;
      default:
        index = 0;
    }
    setLoading(true);
    getProjects()
      // .then(async function (snapshot) {
      //   let messageObject = snapshot;
      //   const result = Object.keys(messageObject).map((key) => ({
      //     ...messageObject[key],
      //     id: key,
      //   }));
      //   setProjects(result);
      //   setAllProjects(result);
      //   setSelectedProject(result[index]);
      // })
      .then((projects) => {
        // var data = [];
        // // console.log(snapshot.docs)
        if (projects.length > 0) {
          // snapshot.docs.forEach((doc) => {
          //   data.push(doc.data());
          // });
          // // // console.log(data)
          // const result = data.map((value, index) => {
          //   return {
          //     ...value,
          //     id: value.id,
          //   };
          // });
          // // console.log(projects)
          setProjects(projects);
          setAllProjects(projects);
          // // console.log(projects);
          setSelectedProject(projects[index]);
        }
      })
      .catch(function (error) {
        alert("Something went wrong. Please try again after some time.");
        // console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchUserProfile = async () => {
    if (currentUser) {
      // console.log(currentUser);
      setLoading(true);
      getUser(currentUser?.uid).then((profile) => {
        setProfile(profile);
        // // console.log(snapshot.data())
      });
      if ((profile && profile?.length === 0) || profile === null) {
        getUser(currentUser?.uid).then((profile) => {
          setProfile(profile);
          // // console.log(snapshot.data())
          if (profile?.role === "Organization") {
            navigate("/profile");
          }
        });
      }
      // setProfile(profileUser);
      setLoading(false);
    }
  };
  let devMap = {};
  const fetchDevelpersData = (state1) => {
    let index1 = 0;
    switch (state1) {
      case "ADD":
        index1 = allDevelopers.length;
        break;
      case "EDIT":
        index1 = allDevelopers.indexOf(selectedDevelopers);
        break;
      default:
        index1 = 0;
    }
    setLoading(true);
    getDevelopers()
      // .then(async function (snapshot) {
      //   let messageObject = snapshot;
      //   const result1 = Object.keys(messageObject).map((key) => ({
      //     ...messageObject[key],
      //     id: key,
      //   }));
      //   setDevelopers(result1);
      //   setAllDevelopers(result1);
      //   setSelectedDevelopers(result1[index1]);
      //   result1.forEach((itm) => {
      //     devMap[itm.email] = {
      //       name: itm.name,
      //       id: itm.id,
      //     };
      //   });
      //   setDevHash(devMap);
      // })
      .then((devs) => {
        //var data = [];
        if (devs.length > 0) {
          // // console.log(snapshot.docs)
          // devs.forEach((doc) => {
          //   data.push({
          //     ...doc,
          //     id: doc.id,
          //   });
          // });
          setDevelopers(devs);
          setAllDevelopers(devs);
          setSelectedDevelopers(devs[index1]);
          devs.forEach((itm) => {
            devMap[itm.email] = {
              name: itm.name,
              id: itm.id,
            };
          });
          setDevHash(devMap);
        }
      })
      .catch(function (error) {
        alert("Something went wrong. Please try again after some time.");
        // console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const getAbilities = async () => {
    await getSkills().then(async (snapshot) => {
      setSkills(Object.values(snapshot.data()));
    });
  };
  const getTagDetails = async () => {
    await getTags().then(async (snapshot) => {
      setTags(Object.values(snapshot.data()));
    });
  };
  useEffect(() => {
    fetchData();
    fetchDevelpersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchUserProfile();
    fetchRequests();
    fetchRequestsRecieved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  useEffect(() => {
    getAbilities();
  }, []);

  useEffect(() => {
    getTagDetails();
  }, []);
  useEffect(async () => {
    if (profile?.role == "Organization") {
      const myjobs = await getJobsOrg(profile?.id);
      setMyJobs(myjobs);
    }
  }, [profile]);
  const fetchRequests = async () => {
    if (currentUser) {
      setLoading(true);
      setRequests(await getRequests(currentUser.uid));
      setLoading(false);
    }
  };
  const fetchRequestsRecieved = async () => {
    if (currentUser) {
      setLoading(true);
      setRequestsRecieved(await getRequestsRecieved(currentUser.uid));
      setLoading(false);
    }
  };
  const handleSearch = (searchtext) => {
    if (searchtext !== "") {
      const modified = allProjects.filter(
        (itm) =>
          itm.name && itm.name.toLowerCase().includes(searchtext.toLowerCase())
      );
      setProjects(modified);
    } else {
      setProjects(allProjects);
    }
  };
  const handleSearchDevelopers = (searchtext) => {
    if (searchtext !== "") {
      setLoading(true);
      const modified = allDevelopers.filter(
        (itm) =>
          itm.name && itm.name.toLowerCase().includes(searchtext.toLowerCase())
      );
      setDevelopers(modified);
      setLoading(false);
    } else {
      setLoading(true);
      setDevelopers(allDevelopers);
      setLoading(false);
    }
  };
  // // console.log(projects, developers);
  return (
    <ProjectContext.Provider
      value={{
        projects,
        developers,
        devHash,
        profile,
        requests,
        requestsRecieved,
        selectedDevelopers,
        allDevelopers,
        setSelectedDevelopers,
        setMyJobs,
        myJobs,
        setDevelopers,
        selectedProject,
        setProjects,
        setSelectedProject,
        loading,
        handleSearch,
        handleSearchDevelopers,
        fetchData,
        fetchDevelpersData,
        fetchUserProfile,
        setProfile,
        fetchRequests,
        fetchRequestsRecieved,
        allProjects,
        companyDetails,
        setCompanyDetails,
        allJobs,
        setJobs,
        skills,
        setSkills,
        tags,
        setTags,
        setAllJobs,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
