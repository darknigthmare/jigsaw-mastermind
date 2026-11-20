extends RefCounted
## Original station scenery. The gameplay controller owns doors and all interactives.
## Coordinates: Y up, floor top at 0, rooms continue along -Z.
## Reserved: x in [-1.4, 1.4] at player height, targets at x=+/-2.45
## and z=-3.6/-10.5/-19, plus the centre of the final wall.

const ROOM_HEIGHT: float = 3.8
const WALL_THICKNESS: float = 0.2
const DOOR_WIDTH: float = 2.4
const DOOR_HEIGHT: float = 2.8


static func build(world: Node3D) -> void:
	if world.has_node("StationLayout"):
		return
	var layout := Node3D.new()
	layout.name = "StationLayout"
	world.add_child(layout)

	var metal := _material(Color("34434c"), 0.58, 0.45)
	var dark_metal := _material(Color("1b2830"), 0.65, 0.53)
	var pale_metal := _material(Color("87979d"), 0.45, 0.61)
	var neutral_box := _material(Color("8d9383"), 0.0, 0.93)
	var blue_box := _material(Color("4c6c7b"), 0.12, 0.79)
	var amber_box := _material(Color("aa8c59"), 0.0, 0.95)

	var rooms: Array[Dictionary] = [
		{
			"id": "Sas", "near_z": 0.0, "far_z": -7.0,
			"wall": Color("596e7b"), "floor": Color("354550"),
			"accent": Color("91cbd3"), "light": Color("d7f1f6"),
		},
		{
			"id": "Galerie", "near_z": -7.0, "far_z": -15.0,
			"wall": Color("5e7364"), "floor": Color("394c42"),
			"accent": Color("afd0a0"), "light": Color("e0f2d9"),
		},
		{
			"id": "Archives", "near_z": -15.0, "far_z": -23.0,
			"wall": Color("796c54"), "floor": Color("504735"),
			"accent": Color("dfbc78"), "light": Color("fff0cd"),
		},
	]
	for room: Dictionary in rooms:
		_room_shell(layout, room, dark_metal)
		_room_light(layout, room, dark_metal)

	# End walls are outside the walkable z interval. The final centre stays bare
	# for the gameplay controller's access validation at z=-22.45/-22.75.
	_box(layout, "EntryEndWall", Vector3(0, 1.9, 0.1), Vector3(8.4, 3.8, 0.2), _material(Color("596e7b")))
	_box(layout, "ArchiveEndWall", Vector3(0, 1.9, -23.1), Vector3(8.4, 3.8, 0.2), _material(Color("796c54")))
	_partition(layout, "SasToGallery", -7.0, _material(Color("4c6066")), dark_metal)
	_partition(layout, "GalleryToArchives", -15.0, _material(Color("657060")), dark_metal)

	# Furniture stops well before the six reserved target positions. These props
	# are visual dressing: no interaction group, prompt, animation or game logic.
	for side: int in [-1, 1]:
		_bench(layout, "WelcomeBench_%s" % side, Vector3(side * 3.4, 0, -1.45), metal, blue_box)
		_lockers(layout, "Lockers_%s" % side, Vector3(side * 3.57, 0, -5.65), side, metal, pale_metal)
		_service_panel(layout, "ServiceNear_%s" % side, Vector3(side * 3.74, 1.5, -8.45), side, dark_metal, metal)
		_service_panel(layout, "ServiceFar_%s" % side, Vector3(side * 3.74, 1.5, -13.05), side, dark_metal, metal)
		_ducts(layout, side, dark_metal, pale_metal)
		_shelf(layout, "ArchiveFront_%s" % side, Vector3(side * 3.47, 0, -16.8), metal, neutral_box, amber_box)
	_shelf(layout, "ArchiveRearLeft", Vector3(-3.47, 0, -21.35), metal, neutral_box, amber_box)
	_archive_table(layout, Vector3(3.25, 0, -21.35), metal, amber_box)

	_label(layout, "SasWallSign", "01  /  SAS D’ACCUEIL", Vector3(-3.87, 2.8, -1.65), Color("d1e4eb"), PI / 2.0, 42, 0.004)
	_label(layout, "GalleryHeader", "02   GALERIE TECHNIQUE", Vector3(0, 3.23, -6.88), Color("dcebd7"), 0.0, 46, 0.0043)
	_label(layout, "ArchiveHeader", "03   ARCHIVES", Vector3(0, 3.23, -14.88), Color("f5dfb4"), 0.0, 48, 0.005)
	_label(layout, "ArchiveEndSign", "STATION DE CONTRÔLE", Vector3(0, 3.18, -22.97), Color("f0dfbf"), 0.0, 44, 0.0045)


static func _room_shell(parent: Node3D, room: Dictionary, trim: StandardMaterial3D) -> void:
	var id: String = room["id"]
	var near_z: float = room["near_z"]
	var far_z: float = room["far_z"]
	var length: float = near_z - far_z
	var centre_z: float = (near_z + far_z) * 0.5
	var wall_colour: Color = room["wall"]
	var floor_colour: Color = room["floor"]
	var accent_colour: Color = room["accent"]
	var wall := _concrete(wall_colour)
	var floor_mat := _concrete(floor_colour)
	var ceiling := _material(wall_colour.darkened(0.28), 0.05, 0.94)
	var path := _concrete(floor_colour.lightened(0.12))
	var accent := _material(accent_colour, 0.12, 0.66)
	_box(parent, id + "Floor", Vector3(0, -0.1, centre_z), Vector3(8, 0.2, length), floor_mat)
	_box(parent, id + "Ceiling", Vector3(0, ROOM_HEIGHT + 0.1, centre_z), Vector3(8.4, 0.2, length), ceiling)
	_box(parent, id + "WalkwayPaint", Vector3(0, 0.004, centre_z), Vector3(2.8, 0.008, length), path, false)
	for side: int in [-1, 1]:
		_box(parent, id + "Wall_%s" % side, Vector3(side * 4.1, 1.9, centre_z), Vector3(WALL_THICKNESS, ROOM_HEIGHT, length), wall)
		_box(parent, id + "Skirting_%s" % side, Vector3(side * 3.96, 0.16, centre_z), Vector3(0.08, 0.32, length), trim, false)
		_box(parent, id + "UpperRail_%s" % side, Vector3(side * 3.95, 2.55, centre_z), Vector3(0.07, 0.055, length), accent, false)
		_box(parent, id + "GuideLine_%s" % side, Vector3(side * 1.49, 0.009, centre_z), Vector3(0.035, 0.012, length - 0.22), accent, false)
		_box(parent, id + "Wainscot_%s" % side, Vector3(side * 3.98, 0.67, centre_z), Vector3(0.05, 0.68, length), trim, false)
		_box(parent, id + "CeilingTrack_%s" % side, Vector3(side * 2.65, ROOM_HEIGHT - 0.12, centre_z), Vector3(0.18, 0.25, length - 0.24), trim, false)
		# Small flush wall panels create a rhythm without reducing the aisle.
		for panel_index: int in range(3):
			var panel_z: float = far_z + 1.1 + panel_index * (length - 2.2) * 0.5
			_box(parent, id + "WallInset_%s_%s" % [side, panel_index], Vector3(side * 3.975, 1.68, panel_z), Vector3(0.035, 1.45, 1.3), _material(wall_colour.lightened(0.035), 0.07, 0.88), false)
	_box(parent, id + "CeilingCrossmemberNear", Vector3(0, ROOM_HEIGHT - 0.18, near_z - 0.65), Vector3(8, 0.36, 0.18), trim, false)
	_box(parent, id + "CeilingCrossmemberFar", Vector3(0, ROOM_HEIGHT - 0.18, far_z + 0.65), Vector3(8, 0.36, 0.18), trim, false)


static func _partition(parent: Node3D, id: String, z: float, wall: StandardMaterial3D, trim: StandardMaterial3D) -> void:
	var side_width: float = (8.0 - DOOR_WIDTH) * 0.5
	var side_x: float = DOOR_WIDTH * 0.5 + side_width * 0.5
	for side: int in [-1, 1]:
		_box(parent, id + "Side_%s" % side, Vector3(side * side_x, ROOM_HEIGHT * 0.5, z), Vector3(side_width, ROOM_HEIGHT, 0.18), wall)
		# The coloured edging sits OUTSIDE the 2.4-wide passage, never in it.
		_box(parent, id + "OuterEdge_%s" % side, Vector3(side * 1.25, 1.4, z + 0.105), Vector3(0.075, 2.8, 0.025), trim, false)
		_box(parent, id + "DoorJamb_%s" % side, Vector3(side * 1.31, 1.4, z - 0.015), Vector3(0.16, 2.8, 0.32), trim, false)
		_box(parent, id + "ThresholdMark_%s" % side, Vector3(side * 0.62, 0.012, z + 0.30), Vector3(0.98, 0.008, 0.08), trim, false)
	var lintel_height: float = ROOM_HEIGHT - DOOR_HEIGHT
	_box(parent, id + "Lintel", Vector3(0, DOOR_HEIGHT + lintel_height * 0.5, z), Vector3(DOOR_WIDTH, lintel_height, 0.18), wall)


static func _room_light(parent: Node3D, room: Dictionary, casing: StandardMaterial3D) -> void:
	var id: String = room["id"]
	var near_z: float = room["near_z"]
	var far_z: float = room["far_z"]
	var centre_z: float = (near_z + far_z) * 0.5
	var colour: Color = room["light"]
	_box(parent, id + "LightMount", Vector3(0, 3.65, centre_z), Vector3(1.8, 0.14, 0.56), casing, false)
	_box(parent, id + "LightDiffuser", Vector3(0, 3.565, centre_z), Vector3(1.58, 0.035, 0.38), _glow(colour, 1.1), false)
	var light := OmniLight3D.new()
	light.name = id + "CeilingLight"
	light.position = Vector3(0, 3.2, centre_z)
	light.light_color = colour
	light.light_energy = 2.8
	light.omni_range = 8.5
	light.omni_attenuation = 0.8
	# Three unshadowed local lights stay inexpensive in Compatibility/WebGL.
	light.shadow_enabled = false
	parent.add_child(light)


static func _bench(parent: Node3D, id: String, at: Vector3, frame: StandardMaterial3D, upholstery: StandardMaterial3D) -> void:
	_box(parent, id + "Seat", at + Vector3(0, 0.48, 0), Vector3(0.68, 0.12, 1.55), upholstery)
	for end: int in [-1, 1]:
		_box(parent, id + "Leg_%s" % end, at + Vector3(0, 0.22, end * 0.57), Vector3(0.52, 0.44, 0.08), frame)
	var side: float = signf(at.x)
	_box(parent, id + "Back", at + Vector3(side * 0.29, 0.81, 0), Vector3(0.1, 0.57, 1.55), upholstery)


static func _lockers(parent: Node3D, id: String, at: Vector3, side: int, frame: StandardMaterial3D, doors: StandardMaterial3D) -> void:
	_box(parent, id + "Body", at + Vector3(0, 1.04, 0), Vector3(0.66, 2.08, 1.55), frame)
	for index: int in range(3):
		var door_z: float = -0.51 + index * 0.51
		_box(parent, id + "Door_%s" % index, at + Vector3(-side * 0.341, 1.1, door_z), Vector3(0.026, 1.84, 0.46), doors, false)
		_box(parent, id + "Handle_%s" % index, at + Vector3(-side * 0.37, 1.06, door_z + 0.11), Vector3(0.035, 0.16, 0.035), frame, false)
		for vent: int in range(3):
			_box(parent, id + "Vent_%s_%s" % [index, vent], at + Vector3(-side * 0.357, 1.69 + vent * 0.055, door_z), Vector3(0.012, 0.018, 0.26), frame, false)


static func _service_panel(parent: Node3D, id: String, at: Vector3, side: int, body_mat: StandardMaterial3D, face_mat: StandardMaterial3D) -> void:
	_box(parent, id + "Cabinet", at, Vector3(0.36, 0.85, 0.88), body_mat)
	_box(parent, id + "FlatFace", at + Vector3(-side * 0.195, 0, 0), Vector3(0.025, 0.72, 0.74), face_mat, false)
	var marker := _material(Color("b1c7b2"), 0.0, 0.7)
	_box(parent, id + "MaintenanceMark", at + Vector3(-side * 0.212, 0.23, 0), Vector3(0.014, 0.075, 0.54), marker, false)
	for slot: int in range(4):
		_box(parent, id + "Vent_%s" % slot, at + Vector3(-side * 0.212, -0.12 + slot * 0.06, 0), Vector3(0.014, 0.015, 0.45), body_mat, false)
	_label(parent, id + "Caption", "MAINTENANCE", at + Vector3(-side * 0.224, 0.06, 0), Color("d1ded1"), -side * PI / 2.0, 28, 0.0019)


static func _ducts(parent: Node3D, side: int, frame: StandardMaterial3D, finish: StandardMaterial3D) -> void:
	var x: float = side * 3.58
	_box(parent, "GalleryOverheadDuct_%s" % side, Vector3(x, 3.18, -11), Vector3(0.48, 0.33, 7.3), finish, false)
	_box(parent, "GalleryCableTray_%s" % side, Vector3(side * 3.87, 2.9, -11), Vector3(0.12, 0.08, 7.3), frame, false)
	for index: int in range(5):
		_box(parent, "GalleryDuctBand_%s_%s" % [side, index], Vector3(x, 3.18, -7.8 - index * 1.55), Vector3(0.52, 0.37, 0.065), frame, false)


static func _shelf(parent: Node3D, id: String, at: Vector3, frame: StandardMaterial3D, boxes: StandardMaterial3D, warm_boxes: StandardMaterial3D) -> void:
	# One shallow collision volume, entirely beyond x=+/-3.0. Shelf details
	# remain visual children so the open centre cannot snag the player.
	_box(parent, id + "Collision", at + Vector3(0, 1.0, 0), Vector3(0.82, 2.0, 1.65), frame, true, false)
	for side_x: int in [-1, 1]:
		for side_z: int in [-1, 1]:
			_box(parent, id + "Post_%s_%s" % [side_x, side_z], at + Vector3(side_x * 0.37, 1.05, side_z * 0.77), Vector3(0.055, 2.1, 0.055), frame, false)
	for tier: int in range(4):
		var height: float = 0.2 + tier * 0.57
		_box(parent, id + "Shelf_%s" % tier, at + Vector3(0, height, 0), Vector3(0.8, 0.055, 1.63), frame, false)
		if tier < 3:
			for index: int in range(2):
				var box_z: float = -0.39 + index * 0.78
				var box_mat: StandardMaterial3D = boxes if (tier + index) % 2 == 0 else warm_boxes
				_box(parent, id + "Box_%s_%s" % [tier, index], at + Vector3(0, height + 0.2, box_z), Vector3(0.6, 0.34, 0.62), box_mat, false)
				_box(parent, id + "BoxLid_%s_%s" % [tier, index], at + Vector3(0, height + 0.38, box_z), Vector3(0.63, 0.035, 0.65), box_mat, false)
				var side: float = signf(at.x)
				_box(parent, id + "BoxLabel_%s_%s" % [tier, index], at + Vector3(-side * 0.305, height + 0.21, box_z), Vector3(0.012, 0.09, 0.26), _material(Color("dcd9c4")), false)


static func _archive_table(parent: Node3D, at: Vector3, frame: StandardMaterial3D, surface: StandardMaterial3D) -> void:
	_box(parent, "ArchiveTableTop", at + Vector3(0, 0.91, 0), Vector3(1.1, 0.12, 1.8), surface)
	for side_x: int in [-1, 1]:
		for side_z: int in [-1, 1]:
			_box(parent, "ArchiveTableLeg_%s_%s" % [side_x, side_z], at + Vector3(side_x * 0.43, 0.43, side_z * 0.75), Vector3(0.07, 0.86, 0.07), frame)
	_box(parent, "ArchiveClosedFolder", at + Vector3(0, 0.993, -0.28), Vector3(0.49, 0.04, 0.35), _material(Color("43535a")), false)
	_box(parent, "ArchivePaperStack", at + Vector3(0, 1.005, 0.31), Vector3(0.39, 0.07, 0.29), _material(Color("d7d3bd")), false)


static func _material(colour: Color, metallic: float = 0.0, roughness: float = 0.85) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = colour
	material.metallic = metallic
	material.roughness = roughness
	return material


static func _glow(colour: Color, energy: float) -> StandardMaterial3D:
	var material := _material(colour, 0.0, 0.6)
	material.emission_enabled = true
	material.emission = colour
	material.emission_energy_multiplier = energy
	return material


static func _concrete(colour: Color) -> StandardMaterial3D:
	# Small deterministic local texture, generated in memory. No downloads,
	# image assets, random state or editor imports are needed.
	var image := Image.create(64, 64, false, Image.FORMAT_RGB8)
	for y: int in range(64):
		for x: int in range(64):
			var grain: float = float((x * 73 + y * 151 + x * y * 7) % 31) / 310.0
			var seam: float = 0.06 if x == 0 or y == 0 else 0.0
			image.set_pixel(x, y, colour.darkened(grain + seam))
	image.generate_mipmaps()
	var material := _material(Color.WHITE, 0.02, 0.93)
	material.albedo_texture = ImageTexture.create_from_image(image)
	material.texture_filter = BaseMaterial3D.TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC
	material.uv1_triplanar = true
	material.uv1_scale = Vector3(0.75, 0.75, 0.75)
	return material


static func _box(parent: Node3D, id: String, at: Vector3, size: Vector3, material: StandardMaterial3D, solid: bool = true, visible: bool = true) -> Node3D:
	var node: Node3D
	if solid:
		var body := StaticBody3D.new()
		body.collision_layer = 1
		body.collision_mask = 1
		var collision := CollisionShape3D.new()
		var shape := BoxShape3D.new()
		shape.size = size
		collision.shape = shape
		body.add_child(collision)
		node = body
	else:
		node = Node3D.new()
	node.name = id
	node.position = at
	if visible:
		var mesh_instance := MeshInstance3D.new()
		var mesh := BoxMesh.new()
		mesh.size = size
		mesh_instance.mesh = mesh
		mesh_instance.material_override = material
		node.add_child(mesh_instance)
	parent.add_child(node)
	return node


static func _label(parent: Node3D, id: String, caption: String, at: Vector3, colour: Color, turn: float = 0.0, font_size: int = 44, pixel_size: float = 0.004) -> void:
	var label := Label3D.new()
	label.name = id
	label.text = caption
	label.position = at
	label.rotation.y = turn
	label.font_size = font_size
	label.pixel_size = pixel_size
	label.modulate = colour
	label.outline_size = 4
	label.outline_modulate = Color("1b242a")
	label.no_depth_test = false
	label.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(label)
