import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export interface PageHeaderProps {
  title: string;
  /** When provided, a "Create New" button is rendered. */
  onCreateClick?: () => void;
  createLabel?: string;
}

export default function PageHeader({
  title,
  onCreateClick,
  createLabel = "Create New",
}: PageHeaderProps) {
  return (
    <Box className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="h4">{title}</Typography>

      {onCreateClick && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateClick}
        >
          {createLabel}
        </Button>
      )}
    </Box>
  );
}
