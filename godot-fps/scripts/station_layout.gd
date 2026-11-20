extends RefCounted
## Original station scenery. The gameplay controller owns doors and all interactives.
## Coordinates: Y up, floor top at 0, rooms continue along -Z.
## Reserved: x in [-1.4, 1.4] at player height, targets at x=+/-2.45
## and z=-3.6/-10.5/-19, plus the centre of the final wall.
## Maintenance branch: x=[4, 8.6], z=[-20.5, -9.3]; two east-wall bays.
## Its central aisle and the two station footprints are owned by gameplay.
## Evacuation post: x=[-4,4], z=[-31,-23]. Its door, two station footprints
## at (+/-2.45,-26.2), and the exit at (0,-30.45) belong to gameplay.

const ROOM_HEIGHT: float = 3.8
const WALL_THICKNESS: float = 0.2
const DOOR_WIDTH: float = 2.4
const DOOR_HEIGHT: float = 2.8
const WORKSHOP_BAY_WIDTH: float = 2.3
const WORKSHOP_CENTRE_X: float = 6.3
const Dressing = preload("res://scripts/station_dressing.gd")
const EvacuationDressing = preload("res://scripts/station_evacuation_dressing.gd")


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
		{
			"id": "Evacuation", "near_z": -23.0, "far_z": -31.0,
			"wall": Color("586979"), "floor": Color("344653"),
			"accent": Color("e0dccb"), "light": Color("e4edf3"),
		},
	]
	for room: Dictionary in rooms:
		_room_shell(layout, room, dark_metal)
		_room_light(layout, room, dark_metal)

	# The former archive end wall becomes a doorway into the evacuation post.
	# Only gameplay adds its door collider; this layout keeps the aperture empty.
	_box(layout, "EntryEndWall", Vector3(0, 1.9, 0.1), Vector3(8.4, 3.8, 0.2), _material(Color("596e7b")))
	_box(layout, "EvacuationEndWall", Vector3(0, 1.9, -31.1), Vector3(8.4, 3.8, 0.2), _concrete(Color("586979")))
	_partition(layout, "SasToGallery", -7.0, _material(Color("4c6066")), dark_metal)
	_partition(layout, "GalleryToArchives", -15.0, _material(Color("657060")), dark_metal)
	_partition(layout, "ArchivesToEvacuation", -23.0, _material(Color("586979")), dark_metal)

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
	_workshop(layout, dark_metal, pale_metal)

	_label(layout, "SasWallSign", "01  /  SAS D’ACCUEIL", Vector3(-3.87, 2.8, -1.65), Color("d1e4eb"), PI / 2.0, 42, 0.004)
	_label(layout, "GalleryHeader", "02   GALERIE TECHNIQUE", Vector3(0, 3.23, -6.88), Color("dcebd7"), 0.0, 46, 0.0043)
	_label(layout, "ArchiveHeader", "03   ARCHIVES", Vector3(0, 3.23, -14.88), Color("f5dfb4"), 0.0, 48, 0.005)
	_evacuation_wayfinding(layout)
	Dressing.build(layout)
	EvacuationDressing.build(layout)


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
		var bay_z: float = 0.0
		if side == 1:
			if id == "Galerie":
				bay_z = -11.3
			elif id == "Archives":
				bay_z = -18.8
		_wall_strip(parent, id + "Wall_%s" % side, Vector3(side * 4.1, 1.9, centre_z), Vector3(WALL_THICKNESS, ROOM_HEIGHT, length), wall, bay_z)
		_wall_strip(parent, id + "Skirting_%s" % side, Vector3(side * 3.96, 0.16, centre_z), Vector3(0.08, 0.32, length), trim, bay_z, false)
		_wall_strip(parent, id + "UpperRail_%s" % side, Vector3(side * 3.95, 2.55, centre_z), Vector3(0.07, 0.055, length), accent, bay_z, false)
		_box(parent, id + "GuideLine_%s" % side, Vector3(side * 1.49, 0.009, centre_z), Vector3(0.035, 0.012, length - 0.22), accent, false)
		_wall_strip(parent, id + "Wainscot_%s" % side, Vector3(side * 3.98, 0.67, centre_z), Vector3(0.05, 0.68, length), trim, bay_z, false)
		_box(parent, id + "CeilingTrack_%s" % side, Vector3(side * 2.65, ROOM_HEIGHT - 0.12, centre_z), Vector3(0.18, 0.25, length - 0.24), trim, false)
		# Small flush wall panels create a rhythm without reducing the aisle.
		for panel_index: int in range(3):
			var panel_z: float = far_z + 1.1 + panel_index * (length - 2.2) * 0.5
			_wall_strip(parent, id + "WallInset_%s_%s" % [side, panel_index], Vector3(side * 3.975, 1.68, panel_z), Vector3(0.035, 1.45, 1.3), _material(wall_colour.lightened(0.035), 0.07, 0.88), bay_z, false)
	_box(parent, id + "CeilingCrossmemberNear", Vector3(0, ROOM_HEIGHT - 0.18, near_z - 0.65), Vector3(8, 0.36, 0.18), trim, false)
	_box(parent, id + "CeilingCrossmemberFar", Vector3(0, ROOM_HEIGHT - 0.18, far_z + 0.65), Vector3(8, 0.36, 0.18), trim, false)


static func _wall_strip(parent: Node3D, id: String, at: Vector3, size: Vector3, material: StandardMaterial3D, bay_z: float, solid: bool = true) -> void:
	# Cut both the real wall AND its non-colliding rails/panels. Otherwise a
	# walkable opening would still appear blocked by a floating strip of trim.
	var far_z: float = at.z - size.z * 0.5
	var near_z: float = at.z + size.z * 0.5
	var bay_far: float = bay_z - WORKSHOP_BAY_WIDTH * 0.5
	var bay_near: float = bay_z + WORKSHOP_BAY_WIDTH * 0.5
	var bottom: float = at.y - size.y * 0.5
	if bay_z == 0.0 or near_z <= bay_far or far_z >= bay_near or bottom >= DOOR_HEIGHT:
		_box(parent, id, at, size, material, solid)
		return
	var near_piece: float = near_z - maxf(far_z, bay_near)
	if near_piece > 0.001:
		_box(parent, id + "BayNear", Vector3(at.x, at.y, near_z - near_piece * 0.5), Vector3(size.x, size.y, near_piece), material, solid)
	var far_piece: float = minf(near_z, bay_far) - far_z
	if far_piece > 0.001:
		_box(parent, id + "BayFar", Vector3(at.x, at.y, far_z + far_piece * 0.5), Vector3(size.x, size.y, far_piece), material, solid)
	var top: float = at.y + size.y * 0.5
	var above: float = top - DOOR_HEIGHT
	var opening_near: float = minf(near_z, bay_near)
	var opening_far: float = maxf(far_z, bay_far)
	if above > 0.001:
		_box(parent, id + "BayLintel", Vector3(at.x, DOOR_HEIGHT + above * 0.5, (opening_far + opening_near) * 0.5), Vector3(size.x, above, opening_near - opening_far), material, solid)


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
	# Unshadowed local lights stay inexpensive in Compatibility/WebGL.
	light.shadow_enabled = false
	parent.add_child(light)


static func _evacuation_wayfinding(parent: Node3D) -> void:
	var ivory := _material(Color("e0dccb"), 0.04, 0.72)
	var text_colour := Color("edece1")
	# Flat paint remains non-colliding. It sits above the walkway's 0.008 top
	# instead of sharing a coplanar surface with the existing floor overlays.
	for index: int in range(3):
		var z: float = -24.65 - index * 2.05
		for side: int in [-1, 1]:
			var stroke := _box(parent, "EvacuationChevron_%s_%s" % [index, side], Vector3(side * 0.14, 0.021, z), Vector3(0.035, 0.008, 0.4), ivory, false)
			stroke.rotation.y = side * PI / 4.0
	for side: int in [-1, 1]:
		# High ivory bands distinguish this room without adding player obstacles.
		_box(parent, "EvacuationIvoryBand_%s" % side, Vector3(side * 3.94, 3.08, -27), Vector3(0.025, 0.26, 6.5), ivory, false)
	# Incoming sign faces +Z toward readers in the archive; the return sign
	# faces -Z toward readers inside the evacuation room. No billboard flipping.
	_label(parent, "EvacuationEntrySign", "05  /  POSTE D’ÉVACUATION", Vector3(0, 3.22, -22.88), text_colour, 0.0, 44, 0.0043)
	_label(parent, "EvacuationReturnSign", "RETOUR  /  ARCHIVES", Vector3(0, 3.22, -23.12), text_colour, PI, 44, 0.0043)
	_label(parent, "EvacuationExitSign", "SORTIE", Vector3(0, 3.1, -30.97), text_colour, 0.0, 52, 0.0055)


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


static func _workshop(parent: Node3D, frame: StandardMaterial3D, pale_metal: StandardMaterial3D) -> void:
	var annex := Node3D.new()
	annex.name = "MaintenanceAnnex"
	parent.add_child(annex)
	var wall := _concrete(Color("78768b"))
	var floor_mat := _concrete(Color("4c495b"))
	var ceiling := _material(Color("494655"), 0.05, 0.93)
	var accent := _material(Color("c5a4c5"), 0.12, 0.65)
	var copper := _material(Color("b18e78"), 0.38, 0.7)
	var ceramic := _material(Color("aeb7bb"), 0.02, 0.88)
	var muted := _material(Color("646c7b"), 0.16, 0.81)
	# Floor ends exactly where the main floor ends: x=4, with the same y=0 top.
	# The main ceilings already extend to x=4.2, so start this ceiling there.
	_box(annex, "WorkshopFloor", Vector3(6.3, -0.1, -14.9), Vector3(4.6, 0.2, 11.2), floor_mat)
	_box(annex, "WorkshopCeiling", Vector3(6.5, 3.9, -14.9), Vector3(4.6, 0.2, 11.2), ceiling)
	_box(annex, "WorkshopEastWall", Vector3(8.7, 1.9, -14.9), Vector3(0.2, 3.8, 11.6), wall)
	_box(annex, "WorkshopNorthWall", Vector3(6.3, 1.9, -9.2), Vector3(4.6, 3.8, 0.2), wall)
	_box(annex, "WorkshopSouthWall", Vector3(6.3, 1.9, -20.6), Vector3(4.6, 3.8, 0.2), wall)
	_box(annex, "WorkshopAislePaint", Vector3(6.3, 0.004, -14.9), Vector3(1.4, 0.008, 10.7), _concrete(Color("666174")), false)
	_box(annex, "WorkshopEastSkirting", Vector3(8.56, 0.17, -14.9), Vector3(0.08, 0.34, 11.2), frame, false)
	_box(annex, "WorkshopEastHighRail", Vector3(8.56, 2.6, -14.9), Vector3(0.06, 0.055, 11.2), accent, false)
	for index: int in range(5):
		var z: float = -9.6 - index * 2.6
		_box(annex, "WorkshopWallRib_%s" % index, Vector3(8.54, 1.8, z), Vector3(0.08, 3.55, 0.085), frame, false)
	# A separate central doorway is left empty for gameplay's optional door.
	for side: int in [-1, 1]:
		_box(annex, "WorkshopPartitionSide_%s" % side, Vector3(6.3 + side * 1.75, 1.9, -15), Vector3(1.1, 3.8, 0.18), wall)
		_box(annex, "WorkshopDoorEdge_%s" % side, Vector3(6.3 + side * 1.25, 1.4, -14.895), Vector3(0.075, 2.8, 0.025), accent, false)
	_box(annex, "WorkshopPartitionLintel", Vector3(6.3, 3.3, -15), Vector3(2.4, 1.0, 0.18), wall)
	_label(annex, "WorkshopInnerHeader", "PASSAGE DE SERVICE", Vector3(6.3, 3.22, -14.895), Color("eed9eb"), 0.0, 44, 0.004)
	_label(annex, "WorkshopRoomSign", "04  /  ATELIER", Vector3(6.3, 3.05, -9.315), Color("ead9ea"), PI, 46, 0.0045)
	_label(annex, "WorkshopReserveSign", "MODULES DE RÉSERVE", Vector3(6.3, 2.75, -20.485), Color("ead9ea"), 0.0, 40, 0.004)

	for bay_z: float in [-11.3, -18.8]:
		var tag: String = "Gallery" if bay_z > -15.0 else "Archive"
		# Vertical marks are outside the full 2.3-wide bay. No threshold body.
		for side: int in [-1, 1]:
			_box(parent, "WorkshopBay" + tag + "Mark_%s" % side, Vector3(3.89, 1.4, bay_z + side * 1.205), Vector3(0.035, 2.8, 0.055), accent, false)
		_box(annex, "WorkshopBay" + tag + "FloorGuide", Vector3(5.15, 0.02, bay_z), Vector3(2.3, 0.008, 0.045), accent, false)
		_label(parent, "WorkshopBay" + tag + "Header", "ATELIER  /  OPTION", Vector3(3.88, 3.16, bay_z), Color("ead9ea"), -PI / 2.0, 44, 0.0038)
		_label(annex, "WorkshopBay" + tag + "ReturnSign", "GALERIE" if bay_z > -15.0 else "ARCHIVES", Vector3(4.22, 3.16, bay_z), Color("dcdde9"), PI / 2.0, 40, 0.004)

	# No props in the east station footprints: x=[7.0,8.1], y=[0,2],
	# z around -10.6 and -13.5. Their approach from x=6.3 is also empty.
	_workshop_bench(annex, "WorkshopFrontBench", Vector3(4.72, 0, -13.65), frame, copper, ceramic)
	_workshop_bench(annex, "WorkshopRearBench", Vector3(4.72, 0, -16.25), frame, pale_metal, muted)
	_box(annex, "WorkshopNorthStore", Vector3(4.62, 0.9, -9.77), Vector3(0.6, 1.8, 0.64), muted)
	_box(annex, "WorkshopNorthStoreFace", Vector3(4.94, 0.9, -9.77), Vector3(0.035, 1.56, 0.5), pale_metal, false)
	for index: int in range(3):
		_box(annex, "WorkshopNorthStoreLine_%s" % index, Vector3(4.965, 0.55 + index * 0.35, -9.77), Vector3(0.015, 0.025, 0.33), frame, false)
	# A deliberately fictional, sealed display chassis: no moving pieces,
	# real machine layout, controls, fluid systems, wiring or hazardous parts.
	_box(annex, "WorkshopInertChassisBase", Vector3(7.94, 0.2, -16.35), Vector3(0.92, 0.4, 1.16), frame)
	_box(annex, "WorkshopInertChassisCase", Vector3(7.94, 1.03, -16.35), Vector3(0.8, 1.26, 1.0), muted)
	_box(annex, "WorkshopInertChassisCap", Vector3(7.94, 1.71, -16.35), Vector3(0.87, 0.1, 1.08), pale_metal, false)
	for index: int in range(5):
		_box(annex, "WorkshopChassisInertPlate_%s" % index, Vector3(7.505, 0.62 + index * 0.21, -16.35), Vector3(0.045, 0.1, 0.68), copper, false)
	_box(annex, "WorkshopRearShallowStore", Vector3(6.3, 0.42, -20.3), Vector3(1.8, 0.84, 0.3), muted)
	for index: int in range(3):
		_box(annex, "WorkshopRearStorePanel_%s" % index, Vector3(5.7 + index * 0.6, 0.43, -20.135), Vector3(0.51, 0.63, 0.025), ceramic, false)
	_workshop_light(annex, "WorkshopFront", -12.15, Color("ece3fa"), frame)
	_workshop_light(annex, "WorkshopRear", -17.75, Color("dce6fa"), frame)


static func _workshop_bench(parent: Node3D, id: String, at: Vector3, frame: StandardMaterial3D, top_mat: StandardMaterial3D, ceramic: StandardMaterial3D) -> void:
	_box(parent, id + "Top", at + Vector3(0, 0.97, 0), Vector3(0.76, 0.12, 1.35), top_mat)
	for side_x: int in [-1, 1]:
		for side_z: int in [-1, 1]:
			_box(parent, id + "Leg_%s_%s" % [side_x, side_z], at + Vector3(side_x * 0.28, 0.455, side_z * 0.54), Vector3(0.07, 0.91, 0.07), frame)
	_box(parent, id + "LowShelf", at + Vector3(0, 0.25, 0), Vector3(0.66, 0.07, 1.19), frame, false)
	_box(parent, id + "BackBoard", at + Vector3(-0.35, 1.47, 0), Vector3(0.045, 0.82, 1.35), frame, false)
	for index: int in range(3):
		_box(parent, id + "InertBlock_%s" % index, at + Vector3(-0.05, 1.1, -0.37 + index * 0.37), Vector3(0.32, 0.13 + index * 0.035, 0.24), ceramic, false)
		_box(parent, id + "BackBoardTile_%s" % index, at + Vector3(-0.318, 1.52, -0.38 + index * 0.38), Vector3(0.022, 0.23, 0.28), top_mat, false)


static func _workshop_light(parent: Node3D, id: String, z: float, colour: Color, frame: StandardMaterial3D) -> void:
	_box(parent, id + "Fixture", Vector3(WORKSHOP_CENTRE_X, 3.65, z), Vector3(1.35, 0.14, 0.48), frame, false)
	_box(parent, id + "Diffuser", Vector3(WORKSHOP_CENTRE_X, 3.565, z), Vector3(1.15, 0.035, 0.3), _glow(colour, 1.0), false)
	var light := OmniLight3D.new()
	light.name = id + "Light"
	light.position = Vector3(WORKSHOP_CENTRE_X, 3.2, z)
	light.light_color = colour
	light.light_energy = 2.3
	light.omni_range = 6.5
	light.omni_attenuation = 0.85
	light.shadow_enabled = false
	parent.add_child(light)


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
