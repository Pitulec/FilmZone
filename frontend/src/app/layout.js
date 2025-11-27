import "./globals.css";

export const metadata = {
  title: "FilmZone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#2B2D42] text-[#EDF2F4] min-h-screen w-dvw">
        {children}
      </body>
    </html>
  );
}
