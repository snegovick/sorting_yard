default: build

# targets

js_src := map_file \
          util\
          screen\
          sprite\
          map\
          layer \
          proxy \
          game_logic\
          main \
					game_objects

js_out := game

models := locomotive-7-64x64\
          red_tank-7-64x64\
          straight_rail-1-64x128\
          clean_tile-0-64x128\
          straight_angle_rail-3-64x128 \
					tree_tile-3-64x128 \
					platform-3-64x128 \
					straight_angle_rail_fork-3-64x128 \
					straight_angle_rail_fork_2-3-64x128

levels := level_0

default_width := 64

# options

media = $(addprefix ./media/$(1)/,$(2))

map_editor_dir := ./map_editor

# scripts

jsify = $(addsuffix .js,$(1))

build: build-js-bundle map_file.js

build-js-bundle: $(call jsify,$(js_out))

map_file.js: media/maps/level_0.json
	bash ./mkmap.sh

$(call jsify,$(js_out)): $(call jsify,$(js_src))
	@echo 'Building js bundle'
	@cat $^ > $@

clean: clean-js-bundle

clean-js-bundle:
	@echo 'Cleaning js bundle'
	@rm -f $(call jsify,$(js_out))

# sprites

model_name = $(wordlist 1,1,$(subst -, ,$(1)))
model_end_frame = $(wordlist 2,2,$(subst -, ,$(1)))
model_new_size = $(wordlist 3,3,$(subst -, ,$(1)))

# :: <end_frame> -> 0000 0001 ... <end_frame>
model_frames = $(shell seq 0 $(1) | while read d; do printf '%04d\n' $$d; done)

# :: <model> -> source path
model_source = $(addsuffix .blend,$(call media,models,$(call model_name,$(1))))

# :: <model> <size> <frame> -> sprite png
model_sprite = $(addsuffix .png,$(call media,sprites,$(addprefix $(2)_$(call model_name,$(1))/,$(3))))

# :: <model> <size> <frame_prefix> -> sprite pngs
model_sprites = $(call model_sprite,$(1),$(2),$(addprefix $(3),$(call model_frames,$(call model_end_frame,$(1)))))

build: build-sprites

build-sprites: $(addprefix build-sprites-,$(models))

clean: clean-sprites

clean-sprites: $(addprefix clean-sprites-,$(models))

define sprites-ruleset
build-sprites-$(1): $(call model_sprites,$(1),$(default_width),$(call model_name,$(1))_)

$(call model_sprites,$(1),1000): $(call model_source,$(1))
	@echo 'Building sprites for $(1)'
	@mkdir -p $$(sort $$(dir $$@))
	@blender -noaudio -b "$$<" -o "$$(dir $$@)" -F PNG -a

$(call model_sprite,$(1),$(default_width),$(call model_name,$(1))_%): $(call model_sprite,$(1),1000,%)
	@echo 'Rescale sprite $$* for $(1)'
	@mkdir -p $$(sort $$(dir $$@))
	@convert "$$<" -scale $(call model_new_size,$(1)) "$$@"

clean-sprites-$(1):
	@echo 'Cleaning sprites for $(1)'
	@rm -f $(call model_sprites,$(1),1000) $(call model_sprites,$(1),$(default_width),$(call model_name,$(1))_)
	@rm -rf $(dir $(call model_sprites,$(1),1000) $(call model_sprites,$(1),$(default_width)))
endef

$(foreach m,$(models),$(eval $(call sprites-ruleset,$(m))))

# tilesets

tileset_editor := python $(map_editor_dir)/tileset_editor/tileset_editor.py

tilesets = $(addprefix $(call media,tilesets,$(1)).,json png)

build: build-tilesets

build-tilesets: $(addprefix build-tilesets-,$(levels))

clean: clean-tilesets

clean-tilesets: $(addprefix clean-tilesets-,$(levels))

define tilesets-ruleset
build-tilesets-$(1): $(call tilesets,$(1))

$(call tilesets,$(1)): $(call media,tilesets,$(1).tset_project)
	@echo 'Building tilesets for $(1)'
	@$(tileset_editor) --reexport --project $$< --out $$(sort $$(basename $$@))

clean-tilesets-$(1):
	@echo 'Cleaning tilesets for $(1)'
	@rm -f $(call tilesets,$(1))
endef

$(foreach t,$(levels),$(eval $(call tilesets-ruleset,$(t))))

# footer

.PHONY: default build clean
