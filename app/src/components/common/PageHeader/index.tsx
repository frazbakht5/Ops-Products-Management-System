import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import type { PageHeaderProps } from "./types";

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

export type { PageHeaderProps };
