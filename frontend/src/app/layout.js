import "./globals.css";

export const metadata = {
  title: "FilmZone",
  description: "FilmZone lets users browse movies, rate them, and write reviews to share their opinions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
