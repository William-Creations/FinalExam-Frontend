import { useState } from "react";
import { Alert, Autocomplete, Box, Button, Chip, MenuItem, Stack, TextField } from "@mui/material";

const STATUSES = ["Open", "Close", "Cancel"];

// Shared by "create course" and "edit course".
export default function CourseForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    duration: initial?.duration ?? "",
    topics: initial?.topics ?? [],
    price: initial?.price ?? "",
    maxStudent: initial?.maxStudent ?? "",
    status: initial?.status ?? "Open",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        duration: Number(form.duration),
        price: Number(form.price),
        maxStudent: Number(form.maxStudent),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Course name" value={form.name} onChange={set("name")} required />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Duration (days)"
            type="number"
            value={form.duration}
            onChange={set("duration")}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            required
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={set("price")}
            slotProps={{ htmlInput: { min: 0, step: "any" } }}
            required
            fullWidth
          />
          <TextField
            label="Max Student"
            type="number"
            value={form.maxStudent}
            onChange={set("maxStudent")}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
            required
            fullWidth
          />
        </Stack>
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={form.topics}
          onChange={(_, v) => setForm({ ...form, topics: v })}
          renderValue={(value, getItemProps) =>
            value.map((option, index) => {
              const { key, ...props } = getItemProps({ index });
              return <Chip key={key} label={option} size="small" {...props} />;
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Topics"
              helperText="Type a topic and press Enter to add it"
              required={form.topics.length === 0}
            />
          )}
        />
        <TextField select label="Status" value={form.status} onChange={set("status")}>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : submitLabel}
          </Button>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        </Stack>
      </Stack>
    </Box>
  );
}
