import { Timestamp } from "firebase/firestore";

const formatTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) return "N/A";
  return timestamp.toDate().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatTimestamp;
