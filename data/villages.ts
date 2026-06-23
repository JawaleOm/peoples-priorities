export interface Village {
  id: number;
  name: string;
  constituency: string;
  population: number;
  infrastructureScore: number; // 0 to 100 (lower means higher gap)
  latitude: number;
  longitude: number;
}

export const villages: Village[] = [
  { id: 1, name: "Wagholi", constituency: "Pune Shirur", population: 45000, infrastructureScore: 62, latitude: 18.5789, longitude: 73.9789 },
  { id: 2, name: "Hinjawadi", constituency: "Pune Maval", population: 55000, infrastructureScore: 78, latitude: 18.5913, longitude: 73.7389 },
  { id: 3, name: "Baner", constituency: "Pune City", population: 35000, infrastructureScore: 85, latitude: 18.5597, longitude: 73.7797 },
  { id: 4, name: "Hadapsar", constituency: "Pune City", population: 68000, infrastructureScore: 58, latitude: 18.5089, longitude: 73.9258 },
  { id: 5, name: "Kharadi", constituency: "Pune City", population: 42000, infrastructureScore: 70, latitude: 18.5516, longitude: 73.9348 },
  { id: 6, name: "Katraj", constituency: "Pune City", population: 50000, infrastructureScore: 55, latitude: 18.4575, longitude: 73.8567 },
  { id: 7, name: "Warje", constituency: "Pune City", population: 38000, infrastructureScore: 60, latitude: 18.4878, longitude: 73.8058 },
  { id: 8, name: "Yerwada", constituency: "Pune City", population: 75000, infrastructureScore: 45, latitude: 18.5529, longitude: 73.8829 },
  { id: 9, name: "Lohegaon", constituency: "Pune Shirur", population: 30000, infrastructureScore: 50, latitude: 18.5947, longitude: 73.9268 },
  { id: 10, name: "Kondhwa", constituency: "Pune City", population: 82000, infrastructureScore: 48, latitude: 18.4776, longitude: 73.8938 },
  { id: 11, name: "Uruli Kanchan", constituency: "Pune Shirur", population: 28000, infrastructureScore: 40, latitude: 18.4897, longitude: 74.1311 },
  { id: 12, name: "Loni Kalbhor", constituency: "Pune Shirur", population: 32000, infrastructureScore: 42, latitude: 18.4839, longitude: 74.0194 },
  { id: 13, name: "Fursungi", constituency: "Pune Shirur", population: 25000, infrastructureScore: 35, latitude: 18.4742, longitude: 73.9678 },
  { id: 14, name: "Manjri", constituency: "Pune Shirur", population: 29000, infrastructureScore: 52, latitude: 18.5244, longitude: 73.9511 },
  { id: 15, name: "Charholi", constituency: "Pune Shirur", population: 18000, infrastructureScore: 45, latitude: 18.6367, longitude: 73.9114 },
  { id: 16, name: "Moshi", constituency: "Pune Shirur", population: 34000, infrastructureScore: 65, latitude: 18.6711, longitude: 73.8642 },
  { id: 17, name: "Bhosari", constituency: "Pune City", population: 90000, infrastructureScore: 68, latitude: 18.6213, longitude: 73.8447 },
  { id: 18, name: "Chinchwad", constituency: "Pune Maval", population: 110000, infrastructureScore: 80, latitude: 18.6278, longitude: 73.7842 },
  { id: 19, name: "Wakad", constituency: "Pune Maval", population: 60000, infrastructureScore: 82, latitude: 18.5986, longitude: 73.7686 },
  { id: 20, name: "Sangvi", constituency: "Pune City", population: 48000, infrastructureScore: 68, latitude: 18.5778, longitude: 73.8122 },
  { id: 21, name: "Thergaon", constituency: "Pune Maval", population: 52000, infrastructureScore: 72, latitude: 18.6111, longitude: 73.7611 },
  { id: 22, name: "Ravet", constituency: "Pune Maval", population: 40000, infrastructureScore: 74, latitude: 18.6417, longitude: 73.7483 },
  { id: 23, name: "Akurdi", constituency: "Pune Maval", population: 58000, infrastructureScore: 76, latitude: 18.6444, longitude: 73.7842 },
  { id: 24, name: "Talawade", constituency: "Pune Maval", population: 22000, infrastructureScore: 48, latitude: 18.6833, longitude: 73.7833 },
  { id: 25, name: "Nigdi", constituency: "Pune Maval", population: 70000, infrastructureScore: 79, latitude: 18.6575, longitude: 73.7744 },
  { id: 26, name: "Dehu Road", constituency: "Pune Maval", population: 46000, infrastructureScore: 50, latitude: 18.7183, longitude: 73.7222 },
  { id: 27, name: "Alandi", constituency: "Pune Shirur", population: 31000, infrastructureScore: 47, latitude: 18.6758, longitude: 73.8883 },
  { id: 28, name: "Chakan", constituency: "Pune Shirur", population: 64000, infrastructureScore: 55, latitude: 18.7522, longitude: 73.8522 },
  { id: 29, name: "Ranjangaon", constituency: "Pune Shirur", population: 21000, infrastructureScore: 40, latitude: 18.7544, longitude: 74.2483 },
  { id: 30, name: "Shikrapur", constituency: "Pune Shirur", population: 26000, infrastructureScore: 45, latitude: 18.6917, longitude: 74.1136 },
  { id: 31, name: "Sanaswadi", constituency: "Pune Shirur", population: 15000, infrastructureScore: 38, latitude: 18.6658, longitude: 74.0733 },
  { id: 32, name: "Perne", constituency: "Pune Shirur", population: 12000, infrastructureScore: 41, latitude: 18.6367, longitude: 74.0244 },
  { id: 33, name: "Lonikand", constituency: "Pune Shirur", population: 19000, infrastructureScore: 48, latitude: 18.6186, longitude: 74.0006 },
  { id: 34, name: "Pisoli", constituency: "Pune City", population: 17000, infrastructureScore: 43, latitude: 18.4556, longitude: 73.9167 },
  { id: 35, name: "Undri", constituency: "Pune City", population: 23000, infrastructureScore: 55, latitude: 18.4542, longitude: 73.9017 },
  { id: 36, name: "Mohammadwadi", constituency: "Pune City", population: 27000, infrastructureScore: 60, latitude: 18.4739, longitude: 73.9178 },
  { id: 37, name: "Mundhwa", constituency: "Pune City", population: 33000, infrastructureScore: 56, latitude: 18.5375, longitude: 73.9197 },
  { id: 38, name: "Keshav Nagar", constituency: "Pune City", population: 20000, infrastructureScore: 50, latitude: 18.5392, longitude: 73.9389 },
  { id: 39, name: "Dhankawadi", constituency: "Pune City", population: 62000, infrastructureScore: 65, latitude: 18.4722, longitude: 73.8583 },
  { id: 40, name: "Karve Nagar", constituency: "Pune City", population: 44000, infrastructureScore: 78, latitude: 18.4906, longitude: 73.8186 },
  { id: 41, name: "Sinhagad Road", constituency: "Pune City", population: 56000, infrastructureScore: 72, latitude: 18.4789, longitude: 73.8208 },
  { id: 42, name: "Pimpri", constituency: "Pune Maval", population: 98000, infrastructureScore: 75, latitude: 18.6228, longitude: 73.8075 },
  { id: 43, name: "Kothrud", constituency: "Pune City", population: 120000, infrastructureScore: 88, latitude: 18.5074, longitude: 73.8078 },
  { id: 44, name: "Aundh", constituency: "Pune City", population: 41000, infrastructureScore: 84, latitude: 18.5581, longitude: 73.8078 },
  { id: 45, name: "Viman Nagar", constituency: "Pune City", population: 39000, infrastructureScore: 80, latitude: 18.5678, longitude: 73.9144 },
  { id: 46, name: "Kalyani Nagar", constituency: "Pune City", population: 28000, infrastructureScore: 83, latitude: 18.5464, longitude: 73.9036 },
  { id: 47, name: "Koregaon Park", constituency: "Pune City", population: 22000, infrastructureScore: 86, latitude: 18.5361, longitude: 73.8939 },
  { id: 48, name: "Camp", constituency: "Pune City", population: 47000, infrastructureScore: 67, latitude: 18.5144, longitude: 73.8822 },
  { id: 49, name: "Shivajinagar", constituency: "Pune City", population: 53000, infrastructureScore: 81, latitude: 18.5314, longitude: 73.8444 },
  { id: 50, name: "Dhanori", constituency: "Pune City", population: 36000, infrastructureScore: 57, latitude: 18.5833, longitude: 73.8958 }
];
