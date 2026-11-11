ALTER TABLE tag
ADD CONSTRAINT unique_tag_names UNIQUE (user_id, name);