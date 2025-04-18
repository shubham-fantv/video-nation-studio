import React from "react";
import { useRouter } from "next/router";

const Edit = () => {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);
  return (
    <div className="h-screen w-screen">
      <iframe
        src={`http://localhost:5173/${slug}`}
        className="w-full h-full"
        style={{ border: "none" }}
        title="Video Editor"
      />
    </div>
  );
};

export default Edit;
