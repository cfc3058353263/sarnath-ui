import axios from "axios";
export default class http {
    constructor() {
        this.host = "42.159.159.65"
        this.port = "12011"
        this.token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJuYW1lIjoiYWRtaW4iLCJhdXRoX3RpbWUiOiIxMi8zMS8yMDIxIDEwOjU3OjMwIEFNIiwiYWRkcmVzcyI6IjQzLDY1LDExNCwxMjgsMTI5LDEzMCwxMzUsMTM2LDEzNywxMzgsMTM5LDE0MCwxNDEsMTQyLDE0MywxNDQsMTQ1LDE1MSwxNTMsMTU0LDE1NSwxNTYsMTU3LDE2MiwxNjMsMTY0LDE2NSwxNjYsMTY3LDE2OCwxNjksMTcwLDE3MSwxNzUsMTc2LDE3OCwxODEsMTgyLDE4MywxODQsMTg1LDE5MCwxOTMsMTk0LDE5NSwyMTgsMjI0LDIyNiwyNzIsMjczLDI3NSwyNzcsMjc5LDI4MCwyODEsMjgyLDI4MywxMzAxLDEzMDIsMTMwMywxMzA1LDEzMDYsMTMwNywxMzA4LDEzMDksMTMxMCwxMzExLDEzMTIsMTMxMywxMzE0LDEzMTUsMTMxNiwxMzE3LDEzMTgsMTMxOSwxMzIwLDEzMjEsMTMyMiwxMzIzLDEzMjQsMTMyNSwxMzI2LDEzMjcsMTMyOCwxMzI5LDEzMzAsMTMzMSwxMzMyLDIzMzMsMjMzNCwyMzM1LDIzMzYsMjMzNywyMzM4LDIzMzksMjM0MCwyMzQxIiwic2lkIjoiMSIsIm5iZiI6MTY0MDkxOTQ1MCwiZXhwIjoxNjQwOTI2NjUwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo1MDAxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMCJ9.Ka70PcBbfoMU_vaCWLk3eYOwehsnt4EcRp51wYpi174"
    }
    doGet(url) {
        let headers = {
            "Content-Type": "application/json;charset=UTF-8"
        }
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "get",
            url: "http://" + this.host + ":" + this.port + "/" + url,
            headers: headers,
            // data: data,
        })
    }
    doPost(url,data) {
        let headers = {
            "Content-Type": "application/json;charset=UTF-8"
        }
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + `${this.token}`;
        }
        return axios({
            method: "post",
            url: "http://" + this.host + ":" + this.port + "/" + url,
            headers: headers,
            data: data,
        })
    }
}