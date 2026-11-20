extends RefCounted
## Original, non-interactive station furnishings. No imported models or textures.
## build() accepts the world or layout root, after the main furniture is built.
## Repeated details share one cube mesh and one MultiMesh per room/material.


static func build(parent: Node3D) -> void:
	if parent.has_node("StationDressing"):
		return
	var dressing := Node3D.new()
	dressing.name = "StationDressing"
	parent.add_child(dressing)
	var palette: Dictionary = _palette(parent)
	var cube := BoxMesh.new()
	cube.size = Vector3.ONE
	var reception := _room(dressing, "ReceptionDressing")
	var gallery := _room(dressing, "GalleryDressing")
	var archives := _room(dressing, "ArchiveDressing")
	var parts: Dictionary = {}
	_reception(reception, parts, palette)
	_flush(reception, parts, palette, cube)
	parts = {}
	_gallery(gallery, parts)
	_flush(gallery, parts, palette, cube)
	parts = {}
	_archives(archives, parts, palette)
	_flush(archives, parts, palette, cube)


static func _reception(parent: Node3D, parts: Dictionary, palette: Dictionary) -> void:
	# The shallow counter fits between the plan terminal and existing lockers.
	# Its nearest edge is z=-4.32, clear of the terminal's reserved surroundings.
	var at := Vector3(3.27, 0, -4.55)
	_solid(parent, "ReceptionCounterCollision", at + Vector3(0, 0.48, 0), Vector3(1.08, 0.96, 0.40))
	_add(parts, "dark", at + Vector3(0, 0.055, 0), Vector3(1.04, 0.11, 0.37))
	_chamfered_slab(parent, "ReceptionCounterCabinet", at + Vector3(0, 0.51, 0), Vector3(1.10, 0.86, 0.40), palette["frame"])
	_chamfered_slab(parent, "ReceptionCounterLedge", at + Vector3(0, 0.99, 0), Vector3(1.16, 0.09, 0.46), palette["pale"])
	_add(parts, "dark", at + Vector3(0, 0.938, 0.018), Vector3(1.08, 0.018, 0.39))
	_add(parts, "blue", at + Vector3(0, 0.54, 0.209), Vector3(0.95, 0.62, 0.018))
	_add(parts, "cyan", at + Vector3(0, 0.82, 0.222), Vector3(0.82, 0.028, 0.012))
	_add(parts, "dark", at + Vector3(0.27, 0.53, 0.225), Vector3(0.018, 0.44, 0.012))
	_handle(parts, Vector3(3.57, 0.61, -4.346), false)
	# A document tray reads as office furniture, never as another gameplay screen.
	_add(parts, "dark", at + Vector3(-0.25, 1.052, 0), Vector3(0.36, 0.025, 0.26))
	_add(parts, "paper", at + Vector3(-0.25, 1.074, 0), Vector3(0.31, 0.025, 0.22))
	_add(parts, "blue", at + Vector3(-0.25, 1.093, -0.008), Vector3(0.33, 0.012, 0.23), -0.05)
	_text(parent, "ReceptionCaption", "ACCUEIL", Vector3(3.12, 0.57, -4.312), 0.0, Color("d1e4eb"), 0.0026)

	# Wall-mounted incoming-document sorter, distinct from the floor lockers.
	var sorter := Vector3(3.80, 1.49, -2.66)
	_add(parts, "dark", sorter, Vector3(0.31, 0.91, 0.54))
	_add(parts, "pale", sorter + Vector3(-0.166, 0, 0), Vector3(0.022, 0.83, 0.49))
	for tier: int in range(4):
		var y: float = 1.18 + tier * 0.205
		_add(parts, "dark", Vector3(3.622, y, -2.66), Vector3(0.016, 0.035, 0.44))
		_add(parts, "paper", Vector3(3.611, y + 0.074, -2.68), Vector3(0.016, 0.095, 0.34))
		_add(parts, "amber" if tier % 2 == 0 else "blue", Vector3(3.600, y + 0.095, -2.58), Vector3(0.012, 0.028, 0.11))
	_add(parts, "cyan", Vector3(3.619, 1.902, -2.66), Vector3(0.016, 0.03, 0.42))


static func _gallery(parent: Node3D, parts: Dictionary) -> void:
	# One new closed equipment rack on the LEFT only: the right-hand bay stays empty.
	var rack := Vector3(-3.56, 0, -9.65)
	_solid(parent, "GalleryRackCollision", rack + Vector3(0, 1.22, 0), Vector3(0.72, 2.44, 1.20))
	_add(parts, "dark", rack + Vector3(0, 0.09, 0), Vector3(0.76, 0.18, 1.25))
	for edge_z: int in [-1, 1]:
		_add(parts, "pale", rack + Vector3(0.365, 1.31, edge_z * 0.59), Vector3(0.045, 2.30, 0.055))
		_add(parts, "frame", rack + Vector3(-0.35, 1.31, edge_z * 0.59), Vector3(0.06, 2.30, 0.055))
	_add(parts, "dark", rack + Vector3(-0.36, 1.30, 0), Vector3(0.04, 2.24, 1.16))
	_add(parts, "frame", rack + Vector3(0, 2.46, 0), Vector3(0.78, 0.08, 1.25))
	for tier: int in range(6):
		var y: float = 0.34 + tier * 0.34
		_add(parts, "frame", rack + Vector3(0, y, 0), Vector3(0.70, 0.30, 1.10))
		_add(parts, "blue" if tier % 3 == 0 else "pale", rack + Vector3(0.365, y, 0), Vector3(0.025, 0.23, 1.02))
		for slot: int in range(5):
			_add(parts, "dark", rack + Vector3(0.383, y - 0.062 + slot * 0.028, 0.10), Vector3(0.012, 0.010, 0.51))
		for end_z: int in [-1, 1]:
			_add(parts, "dark", rack + Vector3(0.389, y, end_z * 0.43), Vector3(0.028, 0.10, 0.024))
		_add(parts, "mint", rack + Vector3(0.384, y + 0.07, -0.285), Vector3(0.012, 0.025, 0.12))

	# Cross-feed above player height connects the two existing overhead duct runs.
	_add(parts, "pale", Vector3(0, 3.35, -9.18), Vector3(7.16, 0.28, 0.43))
	for x: float in [-3.18, -1.58, 1.58, 3.18]:
		_add(parts, "dark", Vector3(x, 3.35, -9.18), Vector3(0.055, 0.32, 0.47))
	_add(parts, "dark", Vector3(0, 3.191, -9.18), Vector3(1.18, 0.036, 0.56))
	for slot: int in range(9):
		_add(parts, "pale", Vector3(-0.49 + slot * 0.1225, 3.164, -9.18), Vector3(0.036, 0.025, 0.46))

	# Return-air grille is beyond the far service panel, well outside the doorway.
	_add(parts, "dark", Vector3(3.89, 1.78, -14.15), Vector3(0.16, 0.80, 0.75))
	_add(parts, "pale", Vector3(3.795, 1.78, -14.15), Vector3(0.026, 0.70, 0.65))
	for slot: int in range(9):
		_add(parts, "dark", Vector3(3.775, 1.52 + slot * 0.065, -14.15), Vector3(0.016, 0.025, 0.55))
	_text(parent, "AirReturnCaption", "RETOUR D’AIR", Vector3(3.759, 2.36, -14.15), -PI / 2.0, Color("d1ded1"), 0.0022)
	# Three short maintenance ticks sit outside the painted central walkway.
	for tick: int in range(3):
		_add(parts, "mint", Vector3(-3.03, 0.014, -8.84 - tick * 0.11), Vector3(0.30, 0.014, 0.035))
	_text(parent, "RackServiceCaption", "M-04  /  VENTILATION", Vector3(-3.94, 2.78, -9.65), PI / 2.0, Color("d1ded1"), 0.0024)


static func _archives(parent: Node3D, parts: Dictionary, palette: Dictionary) -> void:
	# Low flat-file cabinet, rather than another duplicate open archive shelf.
	var cabinet := Vector3(-3.57, 0, -18.50)
	_solid(parent, "ConsultationCabinetCollision", cabinet + Vector3(0, 0.49, 0), Vector3(0.72, 0.98, 1.33))
	_add(parts, "dark", cabinet + Vector3(0, 0.045, 0), Vector3(0.70, 0.09, 1.28))
	_add(parts, "frame", cabinet + Vector3(0, 0.52, 0), Vector3(0.73, 0.87, 1.34))
	_chamfered_slab(parent, "ConsultationCabinetTop", cabinet + Vector3(0, 0.995, 0), Vector3(0.77, 0.08, 1.38), palette["amber"])
	for drawer: int in range(5):
		var y: float = 0.19 + drawer * 0.155
		_add(parts, "neutral", cabinet + Vector3(0.376, y, 0), Vector3(0.026, 0.135, 1.24))
		_add(parts, "dark", cabinet + Vector3(0.394, y, 0), Vector3(0.014, 0.048, 0.24))
		_add(parts, "pale", cabinet + Vector3(0.414, y + 0.035, 0), Vector3(0.035, 0.022, 0.30))
		_add(parts, "paper", cabinet + Vector3(0.395, y, -0.43), Vector3(0.014, 0.052, 0.16))
	_text(parent, "ConsultationCaption", "RÉSERVE DE CONSULTATION", Vector3(-3.955, 1.53, -18.50), PI / 2.0, Color("f0dfbf"), 0.0025)
	_folder_stack(parts, Vector3(-3.55, 1.07, -18.27), 5, true)

	# Small rolling reserve cart, entirely behind the left index terminal.
	var cart := Vector3(-3.60, 0, -19.80)
	_solid(parent, "ReserveCartCollision", cart + Vector3(0, 0.43, 0), Vector3(0.61, 0.80, 0.68))
	for sx: int in [-1, 1]:
		for sz: int in [-1, 1]:
			_add(parts, "dark", cart + Vector3(sx * 0.245, 0.08, sz * 0.27), Vector3(0.075, 0.12, 0.10))
			_add(parts, "pale", cart + Vector3(sx * 0.265, 0.45, sz * 0.30), Vector3(0.035, 0.67, 0.035))
	for y: float in [0.20, 0.69]:
		_add(parts, "frame", cart + Vector3(0, y, 0), Vector3(0.59, 0.045, 0.67))
		_add(parts, "pale", cart + Vector3(-0.28, y + 0.06, 0), Vector3(0.025, 0.10, 0.66))
	_add(parts, "pale", cart + Vector3(0, 0.91, -0.32), Vector3(0.55, 0.035, 0.035))
	_add(parts, "pale", cart + Vector3(0.265, 0.80, -0.32), Vector3(0.035, 0.24, 0.035))
	_add(parts, "pale", cart + Vector3(-0.265, 0.80, -0.32), Vector3(0.035, 0.24, 0.035))
	_folder_stack(parts, cart + Vector3(0, 0.24, -0.05), 4, false)
	_folder_stack(parts, cart + Vector3(0, 0.73, 0.03), 3, true)

	# Populate free top shelves on the EXISTING three shelf frames.
	for shelf: Vector3 in [Vector3(-3.47, 1.9425, -16.8), Vector3(3.47, 1.9425, -16.8), Vector3(-3.47, 1.9425, -21.35)]:
		for index: int in range(11):
			var height: float = 0.27 + (index % 3) * 0.035
			var key: String = ["blue", "amber", "neutral"][index % 3]
			var position: Vector3 = shelf + Vector3(0, height * 0.5, -0.48 + index * 0.085)
			_add(parts, key, position, Vector3(0.43, height, 0.064))
			var inward: float = -signf(shelf.x)
			_add(parts, "paper", position + Vector3(inward * 0.221, 0.025, 0), Vector3(0.012, 0.07, 0.043))
			_add(parts, "dark", position + Vector3(inward * 0.228, -0.07, 0), Vector3(0.012, 0.026, 0.026))

	# Reserve cartons under the existing consultation table, and an outgoing tray
	# at its free far end; existing folder and paper stack remain visible.
	for tier: int in range(2):
		var box_at := Vector3(3.25, 0.21 + tier * 0.33, -21.34)
		_add(parts, "amber" if tier == 0 else "neutral", box_at, Vector3(0.61, 0.30, 0.55))
		_add(parts, "amber", box_at + Vector3(0, 0.16, 0), Vector3(0.64, 0.032, 0.58))
		_add(parts, "paper", box_at + Vector3(-0.313, 0.015, 0), Vector3(0.014, 0.095, 0.22))
		_add(parts, "dark", box_at + Vector3(-0.322, 0.072, 0), Vector3(0.012, 0.026, 0.095))
	_add(parts, "frame", Vector3(3.27, 1.003, -22.01), Vector3(0.45, 0.028, 0.31))
	_folder_stack(parts, Vector3(3.27, 1.032, -22.01), 3, false)


static func _folder_stack(parts: Dictionary, at: Vector3, count: int, warm: bool) -> void:
	for index: int in range(count):
		var y: float = index * 0.022
		var shift: float = float(index % 3 - 1) * 0.012
		_add(parts, "amber" if warm else "blue", at + Vector3(shift, y, 0), Vector3(0.39, 0.018, 0.27))
		_add(parts, "paper", at + Vector3(shift, y + 0.007, 0.008), Vector3(0.35, 0.007, 0.245))
		_add(parts, "neutral", at + Vector3(0.09 + shift, y + 0.005, -0.143), Vector3(0.10, 0.014, 0.035))


static func _handle(parts: Dictionary, at: Vector3, side_facing: bool) -> void:
	var turn: float = PI / 2.0 if side_facing else 0.0
	for end: int in [-1, 1]:
		var offset := Vector3(end * 0.065, 0, 0.014).rotated(Vector3.UP, turn)
		_add(parts, "dark", at + offset, Vector3(0.026, 0.04, 0.035), turn)
	_add(parts, "pale", at + Vector3(0, 0, 0.035).rotated(Vector3.UP, turn), Vector3(0.16, 0.022, 0.024), turn)


static func _room(parent: Node3D, id: String) -> Node3D:
	var node := Node3D.new()
	node.name = id
	parent.add_child(node)
	return node


static func _add(parts: Dictionary, key: String, at: Vector3, size: Vector3, turn: float = 0.0) -> void:
	if not parts.has(key):
		parts[key] = []
	var basis := Basis(Vector3.UP, turn).scaled_local(size)
	parts[key].append(Transform3D(basis, at))


static func _flush(parent: Node3D, parts: Dictionary, palette: Dictionary, cube: BoxMesh) -> void:
	for key: String in parts:
		var transforms: Array = parts[key]
		var multimesh := MultiMesh.new()
		multimesh.transform_format = MultiMesh.TRANSFORM_3D
		multimesh.mesh = cube
		multimesh.instance_count = transforms.size()
		for index: int in range(transforms.size()):
			multimesh.set_instance_transform(index, transforms[index])
		var instance := MultiMeshInstance3D.new()
		instance.name = "Batch_" + key
		instance.multimesh = multimesh
		instance.material_override = palette[key]
		instance.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
		parent.add_child(instance)


static func _solid(parent: Node3D, id: String, at: Vector3, size: Vector3) -> void:
	var body := StaticBody3D.new()
	body.name = id
	body.position = at
	body.collision_layer = 1
	body.collision_mask = 1
	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = size
	collision.shape = shape
	body.add_child(collision)
	parent.add_child(body)


static func _chamfered_slab(parent: Node3D, id: String, at: Vector3, size: Vector3, material: StandardMaterial3D) -> void:
	var half: Vector3 = size * 0.5
	var bevel: float = minf(0.035, minf(size.x, size.z) * 0.10)
	var outline: Array[Vector2] = [
		Vector2(-half.x + bevel, -half.z), Vector2(half.x - bevel, -half.z),
		Vector2(half.x, -half.z + bevel), Vector2(half.x, half.z - bevel),
		Vector2(half.x - bevel, half.z), Vector2(-half.x + bevel, half.z),
		Vector2(-half.x, half.z - bevel), Vector2(-half.x, -half.z + bevel),
	]
	var surface := SurfaceTool.new()
	surface.begin(Mesh.PRIMITIVE_TRIANGLES)
	surface.set_smooth_group(-1)
	for index: int in range(8):
		var a: Vector2 = outline[index]
		var b: Vector2 = outline[(index + 1) % 8]
		var lower_a := Vector3(a.x, -half.y, a.y)
		var lower_b := Vector3(b.x, -half.y, b.y)
		var upper_a := Vector3(a.x, half.y, a.y)
		var upper_b := Vector3(b.x, half.y, b.y)
		# Godot front faces use clockwise winding, including the horizontal caps.
		for point: Vector3 in [Vector3(0, half.y, 0), upper_a, upper_b, Vector3(0, -half.y, 0), lower_b, lower_a, lower_a, upper_b, upper_a, lower_a, lower_b, upper_b]:
			surface.add_vertex(point)
	surface.generate_normals()
	var instance := MeshInstance3D.new()
	instance.name = id
	instance.mesh = surface.commit()
	instance.material_override = material
	instance.position = at
	instance.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(instance)


static func _text(parent: Node3D, id: String, caption: String, at: Vector3, turn: float, colour: Color, pixel_size: float) -> void:
	var label := Label3D.new()
	label.name = id
	label.text = caption
	label.position = at
	label.rotation.y = turn
	label.font_size = 28
	label.pixel_size = pixel_size
	label.modulate = colour
	label.outline_size = 3
	label.outline_modulate = Color("1b242a")
	label.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(label)


static func _palette(parent: Node3D) -> Dictionary:
	# Reuse the layout's material resources when build() follows Layout.build().
	# A standalone build has deterministic fallbacks for the same palette.
	var existing: Dictionary = {}
	_collect_materials(parent, existing)
	var colours: Dictionary = {
		"frame": "34434c", "dark": "1b2830", "pale": "87979d",
		"blue": "4c6c7b", "neutral": "8d9383", "amber": "aa8c59",
		"paper": "d7d3bd", "mint": "afd0a0", "cyan": "91cbd3",
	}
	var result: Dictionary = {}
	for key: String in colours:
		var hex: String = colours[key]
		if existing.has(hex):
			result[key] = existing[hex]
		else:
			var material := StandardMaterial3D.new()
			material.albedo_color = Color(hex)
			material.roughness = 0.88 if key in ["paper", "neutral", "amber"] else 0.62
			material.metallic = 0.0 if key in ["paper", "neutral", "amber"] else 0.45
			result[key] = material
	return result


static func _collect_materials(node: Node, found: Dictionary) -> void:
	if node is MeshInstance3D:
		var material: Material = node.material_override
		if material is StandardMaterial3D:
			found[material.albedo_color.to_html(false)] = material
	for child: Node in node.get_children():
		_collect_materials(child, found)
