import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import styles from "./styles";

function Sidebar({ children }) {
  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.sidebar}>
        <div class="flex h-screen">
          <aside class="p-6">
            <ul>
              <Link href={"/"} passHref>
                <li class="mb-6 cursor-pointer rounded-xl bg-[#FFFFFF0D] p-3 flex items-center">
                  <span class="text-white mr-3">
                    <svg
                      class="w-6 h-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                  </span>
                  <span class="text-gray-300">Home</span>
                </li>
              </Link>
            </ul>

            <div class="mb-4">
              <h2 class="text-white text-base font-semibold px-4 mb-2">Studios</h2>
              <ul>
                <li>
                  <a href="/video-studio" class="flex items-center pl-4 py-2">
                    <span class="text-white mr-3">
                      <svg
                        class="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17 10.5V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
                      </svg>
                    </span>
                    <span class="text-sm text-[#D2D2D2]">Video Studio</span>
                  </a>
                </li>
                <li>
                  <a href="/image-studio" class="flex items-center pl-4 py-2">
                    <span class="text-white mr-3">
                      <svg
                        class="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l3.5 4.5H6l2.5-3z" />
                      </svg>
                    </span>
                    <span class="text-sm text-[#D2D2D2]">Image Studio</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="mt-6">
              <h2 class="text-white text-base font-semibold px-4 mb-2">
                Subscription and Billings
              </h2>
              <ul>
                <li>
                  <a href="#" class="flex items-center pl-4 py-2">
                    <span class="text-white mr-3">
                      <svg
                        class="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4h20zM2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6H2z" />
                      </svg>
                    </span>
                    <span class="text-sm text-[#D2D2D2]">Manage Subscription</span>
                  </a>
                </li>
                <li>
                  <a href="#" class="flex items-center pl-4 py-2">
                    <span class="text-white mr-3">
                      <svg
                        class="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4C2.9 2 2 2.9 2 4v6c0 1.1.9 2 2 2h16zM4 14c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H4z" />
                      </svg>
                    </span>
                    <span class="text-sm text-[#D2D2D2]">Rewards</span>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Box>
      <Box sx={styles.mainWrapper}>
        <Box sx={styles.contentFavtv}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
