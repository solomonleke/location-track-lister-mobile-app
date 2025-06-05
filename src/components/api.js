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
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10770: 'TV Movie',
};


export const getMovies = async () => {
  const commonImage = require('../assets/benz.png');
  return [
    {
      key: '1',
      title: 'BUS STATION',
      poster: commonImage,
      backdrop: commonImage,
      rating: 8.0,
      description: 'A soldier fighting aliens gets to relive the same day over and over again.',
      releaseDate: '2014-06-06',
      genres: [genres[28], genres[878]],
    },
    {
      key: '2',
      title: 'HOTEL',
      poster: require('../assets/hotel.png'),
      backdrop: require('../assets/hotel.png'),
      rating: 8.4,
      description: 'Aspiring musician Miguel enters the Land of the Dead.',
      releaseDate: '2017-11-22',
      genres: [genres[16], genres[10751], genres[10402]],
    },
    {
      key: '3',
      title: 'FUEL',
      poster: require('../assets/gas2.png'),
      backdrop: require('../assets/gas2.png'),
      rating: 8.5,
      description: 'In Gotham City, a mentally troubled comedian embarks on a downward spiral.',
      releaseDate: '2019-10-04',
      genres: [genres[80], genres[18], genres[53]],
    },
    {
      key: '4',
      title: 'HOSPITAL',
      poster: require('../assets/hospital2.png'),
      backdrop: require('../assets/hospital2.png'),
      rating: 8.4,
      description: 'After the devastating events, the Avengers assemble once more.',
      releaseDate: '2019-04-26',
      genres: [genres[28], genres[12], genres[878]],
    },
    {
      key: '5',
      title: 'RESTAURANT',
      poster: require('../assets/resturant.png'),
      backdrop: require('../assets/resturant.png'),
      rating: 8.1,
      description: 'Young Riley is guided by her emotions through life changes.',
      releaseDate: '2015-06-19',
      genres: [genres[16], genres[35], genres[10751]],
    },
    {
      key: '6',
      title: 'PHARMACY',
      poster: require('../assets/phamacy.png'),
      backdrop: require('../assets/phamacy.png'),
      rating: 8.8,
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      releaseDate: '2010-07-16',
      genres: [genres[28], genres[878], genres[53]],
    },
    {
      key: '7',
      title: 'BANK',
      poster: require('../assets/bank.png'),
      backdrop: require('../assets/bank.png'),
      rating: 8.6,
      description: 'Greed and class discrimination threaten the newly formed symbiotic relationship.',
      releaseDate: '2019-11-08',
      genres: [genres[35], genres[18], genres[53]],
    },
  ];
};
