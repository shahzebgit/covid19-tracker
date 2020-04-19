import axios from 'axios';

const apiUrl = 'https://api.covid19india.org';
const arcgisDistrictUrl = 'https://services9.arcgis.com/HwXIp55hAoiv6DE9/ArcGIS/rest/services/District_Wise_Covid_19_Status_view/FeatureServer/0/query';
const cntryApiUrl = 'https://covid19.mathdro.id/api';

export const fetchTNData = async () => {
    try {
        const { data: { features } } = await axios.get(`${arcgisDistrictUrl}?where=1%3D1&objectIds=&time=&geometry=&
            geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=
            standard&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=
            Name%2C+Positive_Cases%2C+Active_Cases%2C+Recovered%2C+Death%2C+Last_Updated_Date&
            returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&
            maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&
            returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&
            returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&
            groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&
            returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&
            sqlFormat=none&f=json&token=`);
        const stateData = features.sort((a, b) => b.attributes.Positive_Cases - a.attributes.Positive_Cases)
            .map(({ attributes: { Name, Positive_Cases, Active_Cases, Recovered,
                Death, Last_Updated_Date } }) => {
                return {
                    stateName: Name,
                    confirmed: Positive_Cases,
                    active: Active_Cases,
                    recovered: Recovered,
                    deaths: Death,
                    lastUpdated: new Date(Last_Updated_Date).toLocaleString()
                }
            });
        return stateData;
    } catch (error) {
        console.log("fetchTNData -> error", error);
    }
}

export const fetchTNGraphData = async () => {
    try {
        const { data: { features } } = await axios.get(`https://services9.arcgis.com/HwXIp55hAoiv6DE9/ArcGIS/rest/services/TN_Covid_Date_Wise_PositiveCases/FeatureServer/0/query?where=1%3D1&
        objectIds=&time=&resultType=none&outFields=*&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&
        returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&
        resultOffset=&resultRecordCount=&sqlFormat=none&f=json&token=`);
        const graphData = features.map(({ attributes: { Date: dt, Positive_Cases } }) => ({ date: new Date(dt).toLocaleDateString(), confirmed: Positive_Cases }));
        return graphData;
    } catch (error) {
        console.log("fetchTNGraphData -> error", error)
    }
}

export const fetchIndiaData = async () => {
    try {
        const {data : {statewise}}  = await axios.get(`${apiUrl}/data.json`);
        // const stateData = data.filter((state) => state.state === "Tamil Nadu")
        const stateData = statewise.filter((a, b) => a.state!=='Total')
            .sort((a, b) => parseInt(b.confirmed) - parseInt(a.confirmed))
            .map(({ state, confirmed, active, recovered,
                deaths, lastupdatedtime}) => {
                return {
                    stateName: state,
                    confirmed: parseInt(confirmed),
                    active: parseInt(active),
                    recovered: parseInt(recovered),
                    deaths: parseInt(deaths),
                    lastUpdated: lastupdatedtime
                }
            });
        return stateData;
    } catch (error) {
        console.log("fetchTNData -> error", error);
    }
}

export const fetchIndiaGraphData = async () => {
    try {
        const {data : {cases_time_series}}  = await axios.get(`${apiUrl}/data.json`);
        // const stateData = data.filter((state) => state.state === "Tamil Nadu")
        const graphData = cases_time_series
            .map(({ dailyconfirmed, dailydeceased, dailyrecovered, date}) => {
                return {
                    date,
                    confirmed: parseInt(dailyconfirmed),
                    recovered: parseInt(dailyrecovered),
                    deaths: parseInt(dailydeceased),
                }
            });
        return graphData;
    } catch (error) {
        console.log("fetchIndiaGraphData -> error", error);
    }
}

export const fetchCntryData = async (country) => {
    let changeableUrl = !country ? cntryApiUrl : `${cntryApiUrl}/countries/${country}`;
    try {
        const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableUrl);
        return { confirmed, recovered, deaths, lastUpdate };
    } catch (error) {
        console.log("fetchCntryData -> error", error)
    }
}

export const fetchDailyData = async () => {
    try {
        const { data } = await axios.get(`${cntryApiUrl}/daily`);
        const modifiedData = data.map(dailyData => ({
            confirmed: dailyData.confirmed.total,
            deaths: dailyData.deaths.total,
            date: dailyData.reportDate
        }));
        return modifiedData;
    } catch (error) {
        console.log("fetchDailyData -> error", error)
    }
}

export const fetchCountries = async () => {
    try {
        const {data: {countries}} = await axios.get(`${cntryApiUrl}/countries`);
        return countries;
    } catch (error) {
        console.log("fetchCountries -> error", error)
    }
}