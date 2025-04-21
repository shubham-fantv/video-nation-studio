// import React from "react";
// import { useRouter } from "next/router";

// const Edit = () => {
//   const router = useRouter();
//   const { slug } = router.query;
//   console.log(slug);
//   return (
//     <div className="h-screen w-screen">
//       <iframe
//         src={`http://localhost:5173/${slug}`}
//         className="w-full h-full"
//         style={{ border: "none" }}
//         title="Video Editor"
//       />
//     </div>
//   );
// };

// export default Edit;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../../src/component/common/Loading/loading";

const Edit = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(true);

  // optional: wait for slug to be available
  useEffect(() => {
    if (slug) {
      setLoading(true);
    }
  }, [slug]);

  return (
    <div className="h-screen w-screen relative">
      {loading && <Loader />}
      {slug && (
        <iframe
          src={`http://20.244.29.252:5173/${slug}`}
          // src={`http://localhost:5173/${slug}`}
          className="w-full h-full"
          style={{ border: "none" }}
          title="Video Editor"
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
};

export default Edit;
