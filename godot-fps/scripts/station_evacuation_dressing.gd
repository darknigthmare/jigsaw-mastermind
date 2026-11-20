extends RefCounted
## Original static furnishings for the slate/ivory evacuation supervision room.
## All low furniture stays behind |x|=3.12; the central aisle, console halos,
## their diagonal approaches and the exit remain unobstructed.
## Reuse the station's procedural primitives and material resources, not models.

const Details = preload("res://scripts/station_dressing.gd")


static func build(layout: Node3D) -> void:
	if layout.has_node("EvacuationDressing"):
		return
	var dressing := Node3D.new()
	dressing.name = "EvacuationDressing"
	layout.add_child(dressing)
	var palette: Dictionary = _palette(layout)
	var parts: Dictionary = {}
	var rods: Array[Transform3D] = []
	_furnish(dressing, parts, rods, palette)
	var cube := BoxMesh.new()
	cube.size = Vector3.ONE
	Details._flush(dressing, parts, palette, cube)
	_flush_rods(dressing, rods, palette["pale"])


static func _furnish(parent: Node3D, parts: Dictionary, rods: Array[Transform3D], palette: Dictionary) -> void:
	_waiting_bench(parent, parts, rods, palette)
	_arrivals_board(parent, parts)
	_supervision_desk(parent, parts, palette)
	_reserve_cabinet(parent, parts, palette)
	_service_details(parent, parts, rods)


static func _waiting_bench(parent: Node3D, parts: Dictionary, rods: Array[Transform3D], palette: Dictionary) -> void:
	# Three individually shaped seats, with a tubular frame and arm dividers.
	var at := Vector3(3.58, 0, -24.55)
	Details._solid(parent, "EvacuationBenchCollision", at + Vector3(0, 0.60, 0), Vector3(0.70, 1.20, 1.95))
	for index: int in range(3):
		var seat_z: float = at.z - 0.62 + index * 0.62
		Details._chamfered_slab(parent, "WaitingSeat_%d" % index, Vector3(3.55, 0.49, seat_z), Vector3(0.61, 0.10, 0.55), palette["ivory"])
		Details._add(parts, "slate", Vector3(3.854, 0.84, seat_z), Vector3(0.075, 0.62, 0.54))
		Details._add(parts, "ivory", Vector3(3.804, 0.86, seat_z), Vector3(0.025, 0.45, 0.46))
		Details._add(parts, "dark", Vector3(3.57, 0.418, seat_z), Vector3(0.53, 0.045, 0.43))
	for end: int in [-1, 1]:
		var z: float = at.z + end * 0.83
		_rod(rods, Vector3(3.35, 0.10, z), Vector3(3.35, 0.42, z), 0.055)
		_rod(rods, Vector3(3.78, 0.10, z), Vector3(3.78, 0.42, z), 0.055)
		_rod(rods, Vector3(3.31, 0.08, z), Vector3(3.83, 0.08, z), 0.065)
	_rod(rods, Vector3(3.56, 0.38, -25.40), Vector3(3.56, 0.38, -23.70), 0.055)
	for divider: int in range(4):
		var z: float = -25.48 + divider * 0.62
		_rod(rods, Vector3(3.77, 0.47, z), Vector3(3.77, 0.69, z), 0.035)
		_rod(rods, Vector3(3.30, 0.69, z), Vector3(3.77, 0.69, z), 0.045)
		Details._add(parts, "dark", Vector3(3.47, 0.717, z), Vector3(0.30, 0.035, 0.064))
	# Folded textile packs on the small under-seat carrier are inert dressing.
	Details._add(parts, "frame", Vector3(3.57, 0.18, -24.55), Vector3(0.47, 0.035, 0.98))
	for pack: int in range(2):
		var z: float = -24.80 + pack * 0.50
		Details._add(parts, "blue", Vector3(3.57, 0.266, z), Vector3(0.39, 0.13, 0.38))
		Details._add(parts, "ivory", Vector3(3.57, 0.336, z), Vector3(0.10, 0.016, 0.37))


static func _arrivals_board(parent: Node3D, parts: Dictionary) -> void:
	# Paper slips and retaining strips, not an additional interactive screen.
	var at := Vector3(-3.935, 1.72, -24.52)
	Details._add(parts, "frame", at, Vector3(0.09, 1.14, 1.85))
	Details._add(parts, "ivory", at + Vector3(0.054, 0, 0), Vector3(0.018, 1.03, 1.72))
	for row: int in range(3):
		var y: float = 1.36 + row * 0.29
		Details._add(parts, "pale", Vector3(-3.858, y - 0.115, -24.52), Vector3(0.024, 0.025, 1.58))
		for column: int in range(4):
			var z: float = -25.08 + column * 0.37
			Details._add(parts, "paper", Vector3(-3.854, y, z), Vector3(0.012, 0.18, 0.29))
			Details._add(parts, "slate", Vector3(-3.844, y + 0.042, z), Vector3(0.012, 0.018, 0.21))
			Details._add(parts, "blue", Vector3(-3.842, y - 0.023, z - 0.062), Vector3(0.012, 0.035, 0.07))
	Details._text(parent, "ArrivalsBoardCaption", "REGISTRE DES ÉQUIPES", Vector3(-3.855, 2.48, -24.52), PI / 2.0, Color("e0dccb"), 0.0027)


static func _supervision_desk(parent: Node3D, parts: Dictionary, palette: Dictionary) -> void:
	var at := Vector3(-3.57, 0, -28.55)
	Details._solid(parent, "SupervisionDeskCollision", at + Vector3(0, 0.43, 0), Vector3(0.73, 0.86, 1.88))
	Details._add(parts, "dark", at + Vector3(0, 0.065, 0), Vector3(0.67, 0.13, 1.79))
	Details._add(parts, "slate", at + Vector3(0, 0.45, 0), Vector3(0.71, 0.69, 1.85))
	Details._chamfered_slab(parent, "SupervisionDeskWorktop", at + Vector3(0, 0.85, 0), Vector3(0.77, 0.09, 1.94), palette["ivory"])
	for drawer: int in range(3):
		var z: float = -29.16 + drawer * 0.61
		Details._add(parts, "pale", Vector3(-3.198, 0.47, z), Vector3(0.025, 0.55, 0.54))
		Details._add(parts, "dark", Vector3(-3.180, 0.47, z), Vector3(0.016, 0.075, 0.15))
		Details._add(parts, "ivory", Vector3(-3.158, 0.515, z), Vector3(0.034, 0.022, 0.20))
		Details._add(parts, "paper", Vector3(-3.178, 0.65, z), Vector3(0.016, 0.06, 0.19))
	# Desk organizers and a clipped, folded paper map; no new control buttons.
	Details._add(parts, "frame", Vector3(-3.52, 0.926, -29.17), Vector3(0.43, 0.058, 0.33))
	for folder: int in range(5):
		var z: float = -29.28 + folder * 0.052
		Details._add(parts, "slate" if folder % 2 == 0 else "ivory", Vector3(-3.52, 1.061, z), Vector3(0.36, 0.24, 0.034))
		Details._add(parts, "paper", Vector3(-3.332, 1.075, z), Vector3(0.012, 0.07, 0.025))
	Details._add(parts, "slate", Vector3(-3.51, 0.911, -28.47), Vector3(0.43, 0.025, 0.53))
	Details._add(parts, "paper", Vector3(-3.51, 0.930, -28.47), Vector3(0.39, 0.014, 0.49))
	for line: int in range(5):
		Details._add(parts, "pale", Vector3(-3.51, 0.940, -28.65 + line * 0.09), Vector3(0.34, 0.004, 0.008))
	Details._add(parts, "dark", Vector3(-3.51, 0.946, -28.69), Vector3(0.13, 0.016, 0.027))

	var board := Vector3(-3.935, 1.94, -28.55)
	Details._add(parts, "frame", board, Vector3(0.09, 1.12, 2.04))
	Details._add(parts, "slate", board + Vector3(0.053, 0, 0), Vector3(0.016, 1.00, 1.92))
	for column: int in range(3):
		var z: float = -29.18 + column * 0.63
		Details._add(parts, "ivory", Vector3(-3.865, 1.96, z), Vector3(0.018, 0.82, 0.52))
		Details._add(parts, "blue", Vector3(-3.851, 2.25, z), Vector3(0.012, 0.085, 0.45))
		for row: int in range(5):
			Details._add(parts, "pale", Vector3(-3.848, 2.11 - row * 0.115, z), Vector3(0.012, 0.013, 0.36))
		for clip_z: int in [-1, 1]:
			Details._add(parts, "dark", Vector3(-3.841, 2.365, z + clip_z * 0.17), Vector3(0.026, 0.045, 0.037))
	Details._text(parent, "SupervisionBoardCaption", "SUPERVISION  /  SECTEURS", Vector3(-3.855, 2.70, -28.55), PI / 2.0, Color("e0dccb"), 0.0026)


static func _reserve_cabinet(parent: Node3D, parts: Dictionary, palette: Dictionary) -> void:
	var at := Vector3(3.57, 0, -28.75)
	Details._solid(parent, "EvacuationReserveCollision", at + Vector3(0, 1.17, 0), Vector3(0.72, 2.34, 1.94))
	Details._add(parts, "dark", at + Vector3(0, 0.07, 0), Vector3(0.69, 0.14, 1.88))
	Details._add(parts, "slate", at + Vector3(0, 1.23, 0), Vector3(0.74, 2.18, 1.96))
	Details._chamfered_slab(parent, "EvacuationReserveCap", at + Vector3(0, 2.36, 0), Vector3(0.78, 0.08, 2.00), palette["pale"])
	for tier: int in range(2):
		for column: int in range(3):
			var y: float = 0.72 + tier * 1.06
			var z: float = -29.38 + column * 0.63
			Details._add(parts, "ivory", Vector3(3.186, y, z), Vector3(0.026, 0.98, 0.58))
			Details._add(parts, "dark", Vector3(3.164, y - 0.05, z + 0.17), Vector3(0.020, 0.19, 0.035))
			Details._add(parts, "pale", Vector3(3.145, y - 0.05, z + 0.17), Vector3(0.026, 0.15, 0.025))
			Details._add(parts, "slate", Vector3(3.166, y + 0.29, z - 0.05), Vector3(0.016, 0.08, 0.29))
			for vent: int in range(3):
				Details._add(parts, "pale", Vector3(3.165, y - 0.28 + vent * 0.055, z), Vector3(0.016, 0.014, 0.36))
	Details._text(parent, "EvacuationReserveCaption", "RÉSERVE DU POSTE", Vector3(3.91, 2.75, -28.75), -PI / 2.0, Color("e0dccb"), 0.0027)


static func _service_details(parent: Node3D, parts: Dictionary, rods: Array[Transform3D]) -> void:
	# High perimeter services stay above the passage and console clearance.
	for side: int in [-1, 1]:
		var x: float = side * 3.73
		_rod(rods, Vector3(x, 3.17, -23.45), Vector3(x, 3.17, -30.55), 0.065)
		_rod(rods, Vector3(x, 3.32, -23.45), Vector3(x, 3.32, -30.55), 0.042)
		for index: int in range(6):
			var z: float = -23.75 - index * 1.26
			Details._add(parts, "dark", Vector3(x, 3.245, z), Vector3(0.13, 0.29, 0.038))
			Details._add(parts, "pale", Vector3(side * 3.875, 3.245, z), Vector3(0.22, 0.045, 0.05))
		Details._add(parts, "slate", Vector3(side * 3.87, 1.20, -30.25), Vector3(0.19, 0.62, 0.82))
		Details._add(parts, "pale", Vector3(side * 3.759, 1.20, -30.25), Vector3(0.028, 0.54, 0.73))
		for slot: int in range(7):
			Details._add(parts, "dark", Vector3(side * 3.739, 0.99 + slot * 0.07, -30.25), Vector3(0.016, 0.025, 0.62))
	# Floor-mounted toe protection on furnishings, not extra centre-line markings.
	Details._add(parts, "pale", Vector3(-3.188, 0.14, -28.55), Vector3(0.028, 0.10, 1.76))
	Details._add(parts, "pale", Vector3(3.182, 0.14, -28.75), Vector3(0.028, 0.10, 1.82))


static func _rod(rods: Array[Transform3D], start: Vector3, end: Vector3, diameter: float) -> void:
	var axis: Vector3 = end - start
	var basis := Basis(Quaternion(Vector3.UP, axis.normalized())).scaled_local(Vector3(diameter, axis.length(), diameter))
	rods.append(Transform3D(basis, (start + end) * 0.5))


static func _flush_rods(parent: Node3D, rods: Array[Transform3D], material: StandardMaterial3D) -> void:
	var cylinder := CylinderMesh.new()
	cylinder.top_radius = 0.5
	cylinder.bottom_radius = 0.5
	cylinder.height = 1.0
	cylinder.radial_segments = 8
	cylinder.rings = 1
	var multimesh := MultiMesh.new()
	multimesh.transform_format = MultiMesh.TRANSFORM_3D
	multimesh.mesh = cylinder
	multimesh.instance_count = rods.size()
	for index: int in range(rods.size()):
		multimesh.set_instance_transform(index, rods[index])
	var instance := MultiMeshInstance3D.new()
	instance.name = "Batch_TubularFrameAndServices"
	instance.multimesh = multimesh
	instance.material_override = material
	instance.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	parent.add_child(instance)


static func _palette(layout: Node3D) -> Dictionary:
	var palette: Dictionary = Details._palette(layout)
	var found: Dictionary = {}
	Details._collect_materials(layout, found)
	for key: String in {"slate": "586979", "ivory": "e0dccb"}:
		var hex: String = "586979" if key == "slate" else "e0dccb"
		if found.has(hex):
			palette[key] = found[hex]
		else:
			var material := StandardMaterial3D.new()
			material.albedo_color = Color(hex)
			material.metallic = 0.18 if key == "slate" else 0.08
			material.roughness = 0.72 if key == "slate" else 0.82
			palette[key] = material
	return palette
