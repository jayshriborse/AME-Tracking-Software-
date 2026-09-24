import React from "react";
import "../src/index.css";
import { AMEProvider } from "../src/context/AMEContext";

export const metadata = {
  title: "AME Tracking System",
  description: "Enterprise Tracking Portal",
  icons: {
    icon: "/al-mulla-logo.png",
    shortcut: "/al-mulla-logo.png",
    apple: "/al-mulla-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/al-mulla-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/al-mulla-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/al-mulla-logo.png" />
      </head>
      <body>
        <AMEProvider>
          {children}
        </AMEProvider>
      </body>
    </html>
  );
}
