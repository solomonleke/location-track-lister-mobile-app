import { API_KEY } from '../utils/config';
// const genres = {
//   12: 'Adventure',
//   14: 'Fantasy',
//   16: 'Animation',
//   18: 'Drama',
//   27: 'Horror',
//   28: 'Action',
//   35: 'Comedy',
//   36: 'History',
//   37: 'Western',
//   53: 'Thriller',
//   80: 'Crime',
//   99: 'Documentary',
//   878: 'Science Fiction',
//   9648: 'Mystery',
//   10402: 'Music',
//   10749: 'Romance',
//   10751: 'Family',
//   10752: 'War',
//   10770: 'TV Movie',
// };

// const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
// const getImagePath = (path) =>
//   `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;
// const getBackdropPath = (path) =>
//   `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

// export const getMovies = async () => {
//   const { results } = await fetch(API_URL).then((x) => x.json());
//   const movies = results.map(
//     ({
//       id,
//       original_title,
//       poster_path,
//       backdrop_path,
//       vote_average,
//       overview,
//       release_date,
//       genre_ids,
//     }) => ({
//       key: String(id),
//       title: original_title,
//       poster: getImagePath(poster_path),
//       backdrop: getBackdropPath(backdrop_path),
//       rating: vote_average,
//       description: overview,
//       releaseDate: release_date,
//       genres: genre_ids.map((genre) => genres[genre]),
//     })
//   );

//   return movies;
// };

const genres = {
  1: 'Navigation',
  2: 'Location Sharing',
  3: 'Smart Devices',
  4: 'Productivity',
  5: 'Utilities',
  6: 'Travel',
  7: 'Emergency',
  8: 'Lifestyle',
  9: 'Real-Time Tracking',
};



export const getMovies = async () => {
  const commonImage = require('../assets/benz.png');
  return [
    {
      key: '1',
      title: 'HOTEL',
      poster: require('../assets/hotel.png'),
      backdrop: require('../assets/hotel.png'),
      rating: 4.8,
      description: 'Locate nearby hotels and share directions in one tap.',
      releaseDate: '2025-07-01',
      genres: [genres[1], genres[2], genres[6]],
    },
    {
      key: '2',
      title: 'FUEL',
      poster: require('../assets/gas2.png'),
      backdrop: require('../assets/gas2.png'),
      rating: 4.9,
      description: 'Find and navigate to nearby gas stations instantly.',
      releaseDate: '2025-07-02',
      genres: [genres[1], genres[5], genres[6]],
    },
    {
      key: '3',
      title: 'HOSPITAL',
      poster: require('../assets/hospital2.png'),
      backdrop: require('../assets/hospital2.png'),
      rating: 4.7,
      description: 'Quickly share emergency hospital routes and your live location.',
      releaseDate: '2025-07-03',
      genres: [genres[1], genres[7], genres[9]],
    },
    {
      key: '4',
      title: 'RESTAURANT',
      poster: require('../assets/resturant.png'),
      backdrop: require('../assets/resturant.png'),
      rating: 4.6,
      description: 'Send your exact location and a nearby restaurant link to friends.',
      releaseDate: '2025-07-04',
      genres: [genres[1], genres[6], genres[8]],
    },
    {
      key: '5',
      title: 'PHARMACY',
      poster: require('../assets/phamacy.png'),
      backdrop: require('../assets/phamacy.png'),
      rating: 4.9,
      description: 'Share directions to the nearest pharmacy in real-time.',
      releaseDate: '2025-07-05',
      genres: [genres[2], genres[7], genres[5]],
    },
    {
      key: '6',
      title: 'BANK',
      poster: require('../assets/bank.png'),
      backdrop: require('../assets/bank.png'),
      rating: 4.5,
      description: 'Navigate to the nearest bank and share the route securely.',
      releaseDate: '2025-07-06',
      genres: [genres[1], genres[4], genres[6]],
    },
  ];
};

