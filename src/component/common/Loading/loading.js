import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Box } from "@mui/material";

// const styles = {
//   root: {
//     height: "100vh",
//     display: "flex",
//     backgroundColor: "custom.earnCoinBg",
//     "& > * + *": {
//       marginLeft: "8px",
//     },
//     position: "absolute",
//     height: "100vh",
//     width: "100wv",
//   },
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//     color: "custom.white",
//     margin: "auto",
//     textAlign: "center",
//     "& p": {
//       fontWeight: 600,
//       fontSize: "24px",
//     },
//     "& span": {
//       fontWeight: 400,
//       fontSize: "16px",
//       opacity: "0.5",
//     },
//   },
//   activeCircular: {
//     marginTop: "20px",
//     color: "custom.white !important",
//     zIndex: 10,
//   },
// };

// export default function Loading({ label = "Please wait", text = "Loading", customStyles = {} }) {
//   return (
//     <Box sx={{ ...styles.root, ...customStyles }}>
//       <Box sx={styles.container}>
//         <Typography component="p">{label}</Typography>
//         <Typography component="span">{text}</Typography>
//         <Box>
//           <CircularProgress sx={styles.activeCircular} />
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// import React from "react";

const Loader = ({
  title = "Please wait",
  subTitle = "Loading...",
  percentage = 90,
}) => {
  return (
    <div className="w-full h-full bg-black bg-opacity-80 flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-800 space-y-4">
        {/* Circular Progress */}
        <div className="relative w-28 h-28">
          <svg className="" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-gray-300"
              d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <path
              className="text-transparent"
              d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-purple-700">
            {percentage}%
          </div>
        </div>

        {/* Subtext */}
        <p className="text-center font-medium">
          Polishing the visuals for a stunning finish
        </p>

        {/* Completion Status */}
        <p className="text-sm text-gray-600">{percentage}% completed</p>
      </div>
    </div>
  );
};

export default Loader;
