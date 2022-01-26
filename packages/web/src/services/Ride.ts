import axios from '../helpers/axios';


interface Coordinates {
  lat: number,
  long: number,
}

interface CoursesInterface {
  start?: Coordinates,
  stop?: Coordinates,
}

class Ride {
  private url: string;

  constructor(url: string = null) {
    this.url = url || process.env.REACT_APP_BACKEND;
  }

  async getCourses(courses: CoursesInterface) {
    const { data } = await axios.get(`${this.url}/courses`, { params: courses });
    return data;
  }
}



export default Ride;
