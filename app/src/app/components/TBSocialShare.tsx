"use client";

import {
  FacebookIcon,
  FacebookShareButton,
  ThreadsIcon,
  ThreadsShareButton,
} from "react-share";
import TBInput from "../ui/TBInput";
import { Box, Stack, Typography } from "@mui/material";

type TBSocialShareProps = {
  url: string;
};

export default function TBSocialShare({
  url = "https://example.com",
}: TBSocialShareProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack alignItems="center" justifyContent="center">
        <Box
          component="img"
          src={url}
          alt="Share Image"
          sx={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
          Chia sẻ
        </Typography>
        <FacebookShareButton url={url} hashtag="#vietnammapchecked">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <ThreadsShareButton url={url}>
          <ThreadsIcon size={32} round />
        </ThreadsShareButton>
      </Stack>

      <Box sx={{ width: "100%" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Hoặc chép đường dẫn này gửi bất cứ ai cũng có thể xem hành trình của
          bạn
        </Typography>
        <TBInput
          type="text"
          value={url}
          disabled
          sx={{
            "& .MuiInputBase-input": {
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            },
          }}
        />
      </Box>
    </Box>
  );
}
