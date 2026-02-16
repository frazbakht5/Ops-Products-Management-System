import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AboutPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Ops Products Management System — manage your product catalogue and
        product owners in one place.
      </Typography>
    </Box>
  );
}
