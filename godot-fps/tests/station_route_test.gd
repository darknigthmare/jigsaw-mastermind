extends SceneTree
## Independent headless fixtures; not a browser playthrough.
var station
var checks: Array[Dictionary] = []

func _initialize() -> void:
	call_deferred("_run")

func _check(condition: bool, label: String, details: Dictionary = {}) -> void:
	checks.append({"label": label, "passed": condition, "details": details})
	if not condition:
		push_error("Station route check failed: " + label + " " + JSON.stringify(details))
		print("STATION_ROUTE_RESULT " + JSON.stringify({"passed": false, "checks": checks}))
		quit(1)
		assert(condition, label)

func _terminal(id: String) -> Dictionary:
	for terminal in station._terminals:
		if terminal["id"] == id:
			return terminal
	return {}

func _aim_and_interact(id: String, at: Vector3) -> void:
	station._player.reset_pose(at)
	station._player.set_controls_enabled(false)
	await physics_frame
	await physics_frame
	var terminal := _terminal(id)
	_check(not terminal.is_empty(), "terminal exists: " + id)
	station._camera.look_at(terminal["point"], Vector3.UP)
	var focus: Dictionary = station._find_target()
	_check(focus.get("id", "") == id, "real aim/proximity/line of sight: " + id, {"actual": focus.get("id", "")})
	station._interact()
	await physics_frame
	await physics_frame

func _motion_clear(from: Vector3, to: Vector3, label: String, expected_clear: bool = true) -> void:
	var collision := KinematicCollision3D.new()
	var blocked: bool = station._player.test_move(Transform3D(Basis.IDENTITY, from), to - from, collision, 0.001)
	var blocker: String = str(collision.get_collider().get_path()) if blocked else ""
	_check((not blocked) == expected_clear, label, {"blocked": blocked, "blocker": blocker, "from": str(from), "to": str(to)})

func _floor_supported(from: Vector3, to: Vector3, label: String) -> void:
	var supported := true
	var missing: Array[String] = []
	for step in range(25):
		var at := from.lerp(to, float(step) / 24.0)
		var query := PhysicsRayQueryParameters3D.create(at + Vector3(0, 0.4, 0), at + Vector3(0, -0.4, 0))
		query.exclude = [station._player.get_rid()]
		var hit: Dictionary = station.get_world_3d().direct_space_state.intersect_ray(query)
		if hit.is_empty() or hit["normal"].y < 0.7:
			supported = false
			missing.append(str(at))
	_check(supported, label, {"samples": 25, "missing": missing})

func _run() -> void:
	station = preload("res://station.tscn").instantiate()
	root.add_child(station)
	await physics_frame
	await physics_frame
	_check(station._stage == 0 and station._workshop_stage == 0, "initial states")
	_check(station._terminals.size() == 9 and station._gates.size() == 3, "nine terminals / three gates")
	station._primary_action()
	root.size = Vector2i(960, 480)
	for frame in range(8):
		await process_frame
	_check(station._compact_hud, "short desktop embed uses the compact HUD")
	_check(station._hud.position.y + station._hud.size.y < root.size.y * 0.5, "HUD leaves the aiming reticle clear")
	await _aim_and_interact("workshop_register", Vector3(6.3, 0.04, -10.6))
	_check(station._workshop_stage == 0, "register rejected before relay")
	await _aim_and_interact("badge", Vector3(0, 0.04, -3.6))
	await _aim_and_interact("relay_stable", Vector3(0, 0.04, -10.5))
	_check(station._stage == 2 and station._workshop_stage == 0, "relay unlocks optional branch without completing it")
	_motion_clear(Vector3(0, 0.04, -11.3), Vector3(6.3, 0.04, -11.3), "gallery bay is capsule-passable")
	_floor_supported(Vector3(0, 0, -11.3), Vector3(6.3, 0, -11.3), "gallery bay has continuous floor support")
	_motion_clear(Vector3(6.3, 0.04, -14), Vector3(6.3, 0.04, -16), "optional gate blocks before diagnostic", false)
	await _aim_and_interact("workshop_witness", Vector3(6.3, 0.04, -13.5))
	_check(station._workshop_stage == 0 and not station._gates[2]["collision"].disabled, "witness rejected before register")
	await _aim_and_interact("workshop_register", Vector3(6.3, 0.04, -10.6))
	_check(station._workshop_stage == 1 and station._stage == 2, "register is optional step one, main stage unchanged")
	_check(str(_terminal("workshop_register")["state"].text).contains("ORION"), "ORION marker is visible on registered terminal")
	await _aim_and_interact("workshop_witness", Vector3(6.3, 0.04, -13.5))
	_check(station._workshop_stage == 2 and station._stage == 2, "diagnostic complete, main stage unchanged")
	_check(station._gates[2]["collision"].disabled, "optional gate collision disabled after diagnostic")
	_check(station._workshop_note.text.contains("Diagnostic complet"), "diagnostic visible in HUD")
	_motion_clear(Vector3(6.3, 0.04, -14), Vector3(6.3, 0.04, -18.8), "open optional gate leads to rear bay")
	_motion_clear(Vector3(6.3, 0.04, -18.8), Vector3(3.2, 0.04, -18.8), "rear bay enters archive aisle")
	_motion_clear(Vector3(3.2, 0.04, -18.8), Vector3(3.2, 0.04, -18), "archive aisle bypasses index console")
	_motion_clear(Vector3(3.2, 0.04, -18), Vector3(0, 0.04, -18), "archive centre reached around index console")
	_floor_supported(Vector3(6.3, 0, -18.8), Vector3(0, 0, -18.8), "rear bay has continuous floor support")
	await _aim_and_interact("index_route", Vector3(0, 0.04, -19))
	await _aim_and_interact("exit", Vector3(0, 0.04, -20.9))
	_check(station._finished and station._stage == 4, "optional route can finish")
	_check(station._modal_body.text.contains("diagnostic complet"), "diagnostic appears in completion summary")
	station._reset_run(true)
	await physics_frame
	await physics_frame
	_check(station._stage == 0 and station._workshop_stage == 0 and not station._finished, "replay clears both progress tracks")
	_check(station._terminals.size() == 9 and station._gates.size() == 3, "replay adds no terminal or gate")
	_check(not station._gates[2]["collision"].disabled, "replay recloses optional gate")
	_check(not station._workshop_note.text.contains("Diagnostic complet"), "replay clears diagnostic from HUD")
	await _aim_and_interact("badge", Vector3(0, 0.04, -3.6))
	await _aim_and_interact("relay_eco", Vector3(0, 0.04, -10.5))
	await _aim_and_interact("index_inventory", Vector3(0, 0.04, -19))
	await _aim_and_interact("exit", Vector3(0, 0.04, -20.9))
	_check(station._finished and station._workshop_stage == 0, "main route finishes with no workshop detour")
	_check(station._modal_body.text.contains("détour non effectué"), "skipped optional route is reported honestly")
	print("STATION_ROUTE_RESULT " + JSON.stringify({"passed": true, "scope": "headless fixture interactions and actual capsule collision sweeps; no browser playthrough claimed", "checks": checks}))
	quit(0)
