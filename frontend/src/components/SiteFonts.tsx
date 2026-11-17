import interFont from "../../assets/fonts/inter-variable.ttf";
import japaneseFont from "../../assets/fonts/m-plus-1-japanese-bold.ttf";

// Resolve local fonts through Metro so exported builds work without Google requests.
export default function SiteFonts() {
  return (
    <style>{`
      @font-face {
        font-family: 'Inter';
        src: url('${String(interFont)}') format('truetype');
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
      }
      @font-face {
        font-family: 'M PLUS 1';
        src: url('${String(japaneseFont)}') format('truetype');
        font-style: normal;
        font-weight: 700;
        font-display: swap;
      }
    `}</style>
  );
}
