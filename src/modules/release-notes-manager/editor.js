import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";
import purify from "dompurify";
import {marked} from "marked";
import EditorActions from "./editor-actions";
import Box from '@mui/material/Box';
export default connect(
  "doReleaseNotesSave",
  "doReleaseNotesDelete",
  ({ active, setActive, doReleaseNotesSave, doReleaseNotesDelete }) => {
    if (!active) return null;

    const [version, setVersion] = useState("");
    const [note, setNote] = useState("");
    const [preview, setPreview] = useState(false);

    useEffect(() => {
      if (version !== active.version) setVersion(active.version);
      if (note !== active.note) setNote(active.note);
    }, [active]);

    const handleSave = () => {
      doReleaseNotesSave(
        Object.assign(active, {
          version: version,
          note: note
        })
      );
      setActive(null);
    };

    const handleCancel = () => {
      setActive(null);
    };

    const handleDelete = () => {
      doReleaseNotesDelete(active);
      setActive(null);
    };

    const handleChangeVersion = e => {
      setVersion(e.target.value);
    };

    const handleChangeNote = e => {
      setNote(e.target.value);
    };

    return (
      <Box>
        <div className="form-group">
          <label>Version Number</label>
          <input
            className="form-control"
            type="text"
            placeholder="Version number..."
            value={version}
            onChange={handleChangeVersion}
          ></input>
        </div>
        <div className="clearfix">
          <div className="float-right">
            <button
              onClick={() => {
                setPreview(!preview);
              }}
              className="btn btn-sm btn-secondary"
            >
              Toggle Preview
            </button>
          </div>
        </div>
        <label>Notes</label>
        <div>
          <small className="text-muted">
            Notes are written in markdown and will be parsed to HTML prior to
            display
          </small>
        </div>
        {preview ? (
          <div
            dangerouslySetInnerHTML={{ __html: purify.sanitize(marked(note)) }}
          />
        ) : (
          <div className="form-group">
            <textarea
              value={note}
              onChange={handleChangeNote}
              className="form-control"
              rows="30"
            ></textarea>
          </div>
        )}
        <EditorActions
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </Box>
    );
  }
);
