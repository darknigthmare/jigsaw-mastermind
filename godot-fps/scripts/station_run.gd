extends Node3D
## Original, self-contained exploration loop for Station de contrôle.
## The layout owns architecture; this script owns every interactive object.

const Layout = preload("res://scripts/station_layout.gd")
const Player = preload("res://scripts/station_player.gd")
const INTERACTION_RANGE: float = 2.7
const AIM_ALIGNMENT: float = 0.91

var _player
var _camera: Camera3D
var _terminals: Array[Dictionary] = []
var _gates: Array[Dictionary] = []
var _gate_tweens: Array[Tween] = []
var _stage: int = 0
var _relay_choice: String = ""
var _index_choice: String = ""
var _workshop_stage: int = 0
var _started: bool = false
var _paused: bool = false
var _finished: bool = false
var _elapsed: float = 0.0
var _toast_left: float = 0.0
var _focus_id: String = ""
var _last_pause_frame: int = -1
var _hud_fit_pending: bool = false
var _compact_hud: bool = false

var _ui: Control
var _hud: MarginContainer
var _hud_panel: PanelContainer
var _cards: GridContainer
var _card_labels: Array[Label] = []
var _card_panels: Array[PanelContainer] = []
var _compact_progress: Label
var _workshop_note: Label
var _hud_title: Label
var _objective: Label
var _clock: Label
var _toast: Label
var _prompt: Label
var _interact_button: Button
var _pause_button: Button
var _action_panel: PanelContainer
var _modal: ColorRect
var _modal_panel: PanelContainer
var _modal_title: Label
var _modal_body: Label
var _primary: Button
var _secondary: Button
var _reticle: Label


func _ready() -> void:
	Layout.build(self)
	_build_gameplay()
	_spawn_player()
	_build_ui()
	get_viewport().size_changed.connect(_fit_ui)
	_reset_run(false)
	_fit_ui()
	_emit_web("ready")


func _spawn_player() -> void:
	if is_instance_valid(_player):
		remove_child(_player)
		_player.queue_free()
	_player = Player.new()
	_player.name = "StationPlayer"
	add_child(_player)
	_player.position = Vector3(0.0, 0.04, -1.8)
	_camera = _player.look_camera
	_player.interaction_requested.connect(_interact)
	_player.pause_requested.connect(_toggle_pause)


func _process(delta: float) -> void:
	if not _started or _paused or _finished:
		return
	_elapsed += delta
	_clock.text = _format_time(_elapsed)
	var toast_was_visible: bool = _toast.visible
	_toast_left = maxf(0.0, _toast_left - delta)
	_toast.visible = _toast_left > 0.0 and not _compact_hud
	if toast_was_visible and not _toast.visible:
		_queue_hud_fit()
	var terminal: Dictionary = _find_target()
	var next_focus: String = str(terminal.get("id", ""))
	if next_focus != _focus_id:
		_focus_id = next_focus
		_refresh_terminals()
	_interact_button.disabled = terminal.is_empty()
	if terminal.is_empty():
		_prompt.text = "Approchez un pupitre et regardez son écran."
	else:
		_prompt.text = "E · " + _action_for(str(terminal["id"]))


func _unhandled_input(event: InputEvent) -> void:
	# The controller also emits pause_requested. A frame guard avoids a double toggle.
	if event.is_action_pressed("station_pause") and not event.is_echo():
		_toggle_pause()
		get_viewport().set_input_as_handled()


func _material(color: Color, glowing: bool = false) -> StandardMaterial3D:
	var mat := StandardMaterial3D.new()
	mat.albedo_color = color
	mat.roughness = 0.72
	mat.emission_enabled = glowing
	mat.emission = color
	mat.emission_energy_multiplier = 0.45 if glowing else 0.0
	return mat


func _box(parent: Node3D, dimensions: Vector3, at: Vector3, mat: Material) -> MeshInstance3D:
	var mesh := MeshInstance3D.new()
	var box := BoxMesh.new()
	box.size = dimensions
	mesh.mesh = box
	mesh.material_override = mat
	mesh.position = at
	parent.add_child(mesh)
	return mesh


func _world_label(parent: Node3D, text: String, at: Vector3, font_size: int = 30) -> Label3D:
	var label := Label3D.new()
	label.text = text
	label.position = at
	label.font_size = font_size
	label.pixel_size = 0.004
	label.outline_size = 6
	label.modulate = Color("e3eee8")
	label.no_depth_test = false
	parent.add_child(label)
	return label


func _build_gameplay() -> void:
	_make_gate("BADGE REQUIS · GALERIE", -7.0, 0.0, "ACCÈS OUVERT · GALERIE")
	_make_gate("RELAIS REQUIS · ARCHIVES", -15.0, 0.0, "ACCÈS OUVERT · ARCHIVES")
	_make_gate("ATELIER · DIAGNOSTIC REQUIS", -15.0, 6.3, "ATELIER OUVERT · ARCHIVES")
	_make_terminal("badge", "BADGE D’ACCÈS", "À RÉCUPÉRER", Vector3(-2.45, 0, -3.6))
	_make_terminal("plan", "PLAN DE STATION", "CONSULTER", Vector3(2.45, 0, -3.6))
	_make_terminal("relay_stable", "RELAIS · STABILITÉ", "ÉCLAIRAGE CONTINU", Vector3(-2.45, 0, -10.5))
	_make_terminal("relay_eco", "RELAIS · ÉCONOMIE", "ÉCLAIRAGE RÉDUIT", Vector3(2.45, 0, -10.5))
	_make_terminal("index_route", "INDEX · PARCOURS", "CLASSER PAR SALLE", Vector3(-2.45, 0, -19.0))
	_make_terminal("index_inventory", "INDEX · INVENTAIRE", "CLASSER PAR FONCTION", Vector3(2.45, 0, -19.0))
	_make_terminal("exit", "VALIDATION DE SORTIE", "INDEX REQUIS", Vector3(0, 0, -22.45))
	_make_terminal("workshop_register", "ATELIER · REGISTRE", "RELAIS REQUIS", Vector3(7.55, 0, -10.6))
	_make_terminal("workshop_witness", "ATELIER · TÉMOIN", "REGISTRE REQUIS", Vector3(7.55, 0, -13.5))


func _make_gate(text: String, z: float, x: float = 0.0, opened_text: String = "ACCÈS OUVERT") -> void:
	var root := Node3D.new()
	root.name = "AccessGate%d" % _gates.size()
	root.position = Vector3(x, 0, z)
	add_child(root)
	var body := StaticBody3D.new()
	body.position.y = 1.36
	root.add_child(body)
	var mat := _material(Color("334a4b"))
	_box(body, Vector3(2.36, 2.72, 0.16), Vector3.ZERO, mat)
	_box(body, Vector3(2.15, 0.045, 0.022), Vector3(0, 0.15, 0.097), _material(Color("b7c6b7")))
	_box(body, Vector3(0.035, 2.3, 0.022), Vector3(0, 0, 0.097), _material(Color("172d30")))
	var collision := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(2.36, 2.72, 0.2)
	collision.shape = shape
	body.add_child(collision)
	var label := _world_label(root, text, Vector3(0, 2.35, 0.16), 30)
	_gates.append({"body": body, "collision": collision, "label": label, "closed_text": text, "opened_text": opened_text, "opened": false})


func _make_terminal(id: String, title: String, subtitle: String, at: Vector3) -> void:
	var node := Node3D.new()
	node.name = "Pupitre_" + id
	node.position = at
	if at.x < -0.5:
		node.rotation.y = PI / 2.0
	elif at.x > 0.5:
		node.rotation.y = -PI / 2.0
	add_child(node)
	var body := StaticBody3D.new()
	node.add_child(body)
	_box(body, Vector3(0.82, 1.5, 0.56), Vector3(0, 0.75, 0), _material(Color("263b40")))
	_box(body, Vector3(0.9, 0.08, 0.64), Vector3(0, 0.06, 0), _material(Color("15272c")))
	var screen_material := _material(Color("799d92"), true)
	_box(body, Vector3(0.66, 0.3, 0.03), Vector3(0, 1.34, 0.3), screen_material)
	var shape := BoxShape3D.new()
	shape.size = Vector3(0.84, 1.52, 0.6)
	var collision := CollisionShape3D.new()
	collision.shape = shape
	collision.position.y = 0.76
	body.add_child(collision)
	var title_label := _world_label(node, title, Vector3(0, 1.92, 0.06), 27)
	var state_label := _world_label(node, subtitle, Vector3(0, 1.66, 0.07), 24)
	state_label.modulate = Color("a5c7b3")
	_terminals.append({"id": id, "node": node, "body": body, "screen": screen_material, "title": title_label, "state": state_label, "point": node.to_global(Vector3(0, 1.45, 0.31))})


func _find_target() -> Dictionary:
	if not is_instance_valid(_camera) or not is_instance_valid(_player):
		return {}
	var origin: Vector3 = _camera.global_position
	var forward: Vector3 = -_camera.global_transform.basis.z
	var best: Dictionary = {}
	var best_alignment: float = AIM_ALIGNMENT
	for terminal in _terminals:
		var target: Vector3 = terminal["point"]
		var offset: Vector3 = target - origin
		var distance: float = offset.length()
		if distance > INTERACTION_RANGE or distance < 0.05:
			continue
		var alignment: float = forward.dot(offset / distance)
		if alignment < best_alignment:
			continue
		var query := PhysicsRayQueryParameters3D.create(origin, target)
		query.exclude = [_player.get_rid()]
		var hit: Dictionary = get_world_3d().direct_space_state.intersect_ray(query)
		if not hit.is_empty() and hit.get("collider") != terminal["body"]:
			continue
		best = terminal
		best_alignment = alignment
	return best


func _interact() -> void:
	if not _started or _paused or _finished:
		return
	# Recompute from current camera and physics state, including touch button presses.
	var terminal: Dictionary = _find_target()
	if terminal.is_empty():
		_show_toast("Approchez le pupitre et visez son écran.")
		return
	var id: String = str(terminal["id"])
	match id:
		"plan":
			_show_plan()
		"badge":
			if _stage == 0:
				_stage = 1
				_open_gate(0)
				_emit_web("progress", "badge")
				_show_toast("Badge obtenu. Accès galerie ouvert : choisissez l’un des deux relais.", 6.0)
			else:
				_show_toast("Le badge est déjà dans votre registre d’accès.")
		"relay_stable", "relay_eco":
			if _stage < 1:
				_show_toast("Le relais attend votre badge d’accès.")
			elif _stage > 1:
				_show_toast("Relais confirmé : " + _relay_choice + ". Le choix est conservé pour cette traversée.")
			else:
				_relay_choice = "stabilité" if id == "relay_stable" else "économie"
				_stage = 2
				_open_gate(1)
				_apply_relay_lighting()
				_emit_web("progress", "relais")
				_show_toast("Relais " + _relay_choice + " activé. Archives ouvertes : restaurez l’index. Option : atelier par la baie à droite.", 7.0)
		"index_route", "index_inventory":
			if _stage < 2:
				_show_toast("Activez d’abord un relais dans la galerie.")
			elif _stage > 2:
				_show_toast("Index restauré : " + _index_choice + ". Le pupitre de sortie est disponible.")
			else:
				_index_choice = "par salle" if id == "index_route" else "par fonction"
				_stage = 3
				_emit_web("progress", "index")
				_show_toast("Index restauré " + _index_choice + ". Rejoignez la validation de sortie au fond des archives.", 7.0)
		"workshop_register":
			if _stage < 2:
				_show_toast("Atelier facultatif : activez d’abord un relais dans la galerie.")
			elif _workshop_stage == 0:
				_workshop_stage = 1
				_emit_web("progress", "registre")
				_show_toast("Registre relevé : repère fictif ORION. Comparez le témoin au second pupitre de l’atelier.", 7.0)
			else:
				_show_toast("Registre déjà relevé : repère ORION. Le témoin porte le même repère.")
		"workshop_witness":
			if _stage < 2:
				_show_toast("Le diagnostic facultatif attend l’activation d’un relais.")
			elif _workshop_stage == 0:
				_show_toast("Relevez d’abord le registre sur le premier pupitre de l’atelier.")
			elif _workshop_stage == 1:
				_workshop_stage = 2
				_open_gate(2)
				_emit_web("progress", "atelier")
				_show_toast("Témoin ORION conforme au registre. Diagnostic complet : passage atelier ouvert vers les archives.", 7.0)
			else:
				_show_toast("Diagnostic déjà complet. Le passage atelier reste ouvert ; la route principale est inchangée.")
		"exit":
			if _stage < 3:
				_show_toast("Sortie en attente : badge, relais et index doivent être validés.")
			else:
				_finish_run()
	_refresh_progress()
	_refresh_terminals()


func _action_for(id: String) -> String:
	match id:
		"badge": return "Prendre le badge" if _stage == 0 else "Consulter le badge"
		"plan": return "Lire le plan de station"
		"relay_stable": return "Choisir le relais stabilité" if _stage == 1 else "Consulter le relais stabilité"
		"relay_eco": return "Choisir le relais économie" if _stage == 1 else "Consulter le relais économie"
		"index_route": return "Restaurer l’index par salle" if _stage == 2 else "Consulter l’index par salle"
		"index_inventory": return "Restaurer l’index par fonction" if _stage == 2 else "Consulter l’index par fonction"
		"workshop_register": return "Relever le registre facultatif" if _workshop_stage == 0 else "Consulter le registre ORION"
		"workshop_witness": return "Vérifier le témoin ORION" if _workshop_stage == 1 else "Consulter le diagnostic d’atelier"
		"exit": return "Valider la sortie" if _stage == 3 else "Consulter l’accès de sortie"
	return "Examiner"


func _open_gate(index: int) -> void:
	var gate: Dictionary = _gates[index]
	if bool(gate["opened"]):
		return
	gate["opened"] = true
	var collision: CollisionShape3D = gate["collision"]
	collision.set_deferred("disabled", true)
	var body: StaticBody3D = gate["body"]
	var tween := create_tween()
	tween.tween_property(body, "position:y", 4.24, 0.8).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	_gate_tweens.append(tween)
	var label: Label3D = gate["label"]
	label.text = str(gate["opened_text"])
	label.modulate = Color("a8e1c0")


func _apply_relay_lighting() -> void:
	# Only gameplay-owned lights change; the layout's lighting is preserved.
	for terminal in _terminals:
		if str(terminal["id"]).begins_with("relay_"):
			var node: Node3D = terminal["node"]
			var light := node.get_node_or_null("RelayGlow") as OmniLight3D
			if light == null:
				light = OmniLight3D.new()
				light.name = "RelayGlow"
				light.position = Vector3(0, 1.6, 0.25)
				light.omni_range = 4.5
				node.add_child(light)
			light.light_color = Color("a1d8bf") if _relay_choice == "stabilité" else Color("e5b77a")
			light.light_energy = 1.2 if _relay_choice == "stabilité" else 0.35


func _refresh_terminals() -> void:
	for terminal in _terminals:
		var id: String = str(terminal["id"])
		var state: String = "CONSULTER"
		var color := Color("78968d")
		match id:
			"badge":
				state = "À RÉCUPÉRER" if _stage == 0 else "BADGE OBTENU"
				color = Color("91d6b2")
			"plan": state = "PLAN · TROIS ESPACES"
			"relay_stable", "relay_eco":
				var selected: bool = (_relay_choice == "stabilité" and id == "relay_stable") or (_relay_choice == "économie" and id == "relay_eco")
				state = "CONFIRMÉ · " + _relay_choice.to_upper() if selected else ("AUTRE OPTION · NON RETENUE" if _stage > 1 else ("CHOISIR CE RELAIS" if _stage == 1 else "BADGE REQUIS"))
				color = Color("9ed8b7") if selected else Color("bba77c")
			"index_route", "index_inventory":
				var selected: bool = (_index_choice == "par salle" and id == "index_route") or (_index_choice == "par fonction" and id == "index_inventory")
				state = "RESTAURÉ · " + _index_choice.to_upper() if selected else ("AUTRE OPTION · NON RETENUE" if _stage > 2 else ("CHOISIR CE CLASSEMENT" if _stage == 2 else "RELAIS REQUIS"))
				color = Color("9ed8b7") if selected else Color("98b3c2")
			"workshop_register":
				state = "RELEVÉ · REPÈRE ORION" if _workshop_stage > 0 else ("RELEVER LE REGISTRE" if _stage >= 2 else "RELAIS REQUIS · FACULTATIF")
				color = Color("9ed8b7") if _workshop_stage > 0 else Color("bba77c")
			"workshop_witness":
				state = "DIAGNOSTIC COMPLET" if _workshop_stage == 2 else ("TÉMOIN ORION · VÉRIFIER" if _workshop_stage == 1 else ("RELEVEZ LE REGISTRE" if _stage >= 2 else "RELAIS REQUIS · FACULTATIF"))
				color = Color("9ed8b7") if _workshop_stage == 2 else Color("98b3c2")
			"exit":
				state = "SORTIE VALIDÉE" if _finished else ("PRÊT · VALIDER LA SORTIE" if _stage >= 3 else "INDEX REQUIS")
				color = Color("a7dfbc") if _stage >= 3 else Color("738f8c")
		var label: Label3D = terminal["state"]
		label.text = state
		label.modulate = color
		var screen: StandardMaterial3D = terminal["screen"]
		screen.albedo_color = color.lightened(0.25) if id == _focus_id else color
		screen.emission = screen.albedo_color
		screen.emission_energy_multiplier = 0.9 if id == _focus_id else 0.35


func _style(bg: Color, border: Color, radius: int = 12) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = bg
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 18.0
	style.content_margin_right = 18.0
	style.content_margin_top = 14.0
	style.content_margin_bottom = 14.0
	return style


func _text(text: String, size: int = 18, color: Color = Color("e0eae6")) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return label


func _button(text: String, callback: Callable) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size.y = 48
	button.add_theme_font_size_override("font_size", 18)
	button.add_theme_color_override("font_color", Color("ecf5ef"))
	button.add_theme_stylebox_override("normal", _style(Color("264a48"), Color("598e7b"), 8))
	button.add_theme_stylebox_override("hover", _style(Color("356760"), Color("a9dbbd"), 8))
	button.add_theme_stylebox_override("pressed", _style(Color("1a3638"), Color("b6dec8"), 8))
	button.add_theme_stylebox_override("focus", _style(Color(0, 0, 0, 0), Color("e8dfaf"), 8))
	button.pressed.connect(callback)
	return button


func _build_ui() -> void:
	var layer := CanvasLayer.new()
	layer.name = "StationHUD"
	layer.layer = 10
	add_child(layer)
	_ui = Control.new()
	_ui.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(_ui)
	_hud = MarginContainer.new()
	_hud.position = Vector2(20, 20)
	_hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_ui.add_child(_hud)
	_hud_panel = PanelContainer.new()
	_hud_panel.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	_hud_panel.add_theme_stylebox_override("panel", _style(Color(0.055, 0.10, 0.12, 0.94), Color("345553")))
	_hud_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_hud.add_child(_hud_panel)
	var column := VBoxContainer.new()
	column.add_theme_constant_override("separation", 10)
	column.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_hud_panel.add_child(column)
	var heading := HBoxContainer.new()
	column.add_child(heading)
	var title := _text("STATION DE CONTRÔLE", 18, Color("c7ded0"))
	_hud_title = title
	title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	heading.add_child(title)
	_clock = _text("00:00", 16, Color("9bb6af"))
	_clock.custom_minimum_size.x = 54
	heading.add_child(_clock)
	_objective = _text("", 18)
	column.add_child(_objective)
	_cards = GridContainer.new()
	_cards.columns = 4
	_cards.add_theme_constant_override("h_separation", 7)
	_cards.add_theme_constant_override("v_separation", 7)
	column.add_child(_cards)
	for i in range(4):
		var panel := PanelContainer.new()
		panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		panel.custom_minimum_size = Vector2(112, 60)
		panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
		_cards.add_child(panel)
		var label := _text("", 14)
		panel.add_child(label)
		_card_labels.append(label)
		_card_panels.append(panel)
	_compact_progress = _text("", 14, Color("a7d4ba"))
	_compact_progress.visible = false
	column.add_child(_compact_progress)
	_workshop_note = _text("", 14, Color("a9c6ba"))
	column.add_child(_workshop_note)
	_toast = _text("", 16, Color("d8d7b5"))
	_toast.visible = false
	column.add_child(_toast)
	_reticle = _text("·", 42, Color("e0eee5"))
	_reticle.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
	_reticle.offset_left = -10
	_reticle.offset_top = -28
	_reticle.offset_right = 10
	_reticle.offset_bottom = 28
	_reticle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_ui.add_child(_reticle)
	_action_panel = PanelContainer.new()
	_action_panel.set_anchors_and_offsets_preset(Control.PRESET_CENTER_BOTTOM)
	_action_panel.offset_left = -210
	_action_panel.offset_right = 210
	_action_panel.offset_top = -130
	_action_panel.offset_bottom = -22
	_action_panel.add_theme_stylebox_override("panel", _style(Color(0.055, 0.10, 0.12, 0.94), Color("345553")))
	_ui.add_child(_action_panel)
	var actions := VBoxContainer.new()
	_action_panel.add_child(actions)
	_prompt = _text("Approchez un pupitre et regardez son écran.", 16)
	_prompt.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	actions.add_child(_prompt)
	var buttons := HBoxContainer.new()
	buttons.add_theme_constant_override("separation", 10)
	actions.add_child(buttons)
	_interact_button = _button("Examiner · E", _interact)
	_interact_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	buttons.add_child(_interact_button)
	_pause_button = _button("Pause · P", _toggle_pause)
	_pause_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	buttons.add_child(_pause_button)
	_modal = ColorRect.new()
	_modal.color = Color(0.025, 0.055, 0.07, 0.86)
	_modal.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_ui.add_child(_modal)
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	_modal.add_child(center)
	_modal_panel = PanelContainer.new()
	_modal_panel.add_theme_stylebox_override("panel", _style(Color("10272d"), Color("6d9a85"), 18))
	center.add_child(_modal_panel)
	var modal_column := VBoxContainer.new()
	modal_column.add_theme_constant_override("separation", 20)
	_modal_panel.add_child(modal_column)
	modal_column.add_child(_text("EXPÉRIENCE ORIGINALE · EXPLORATION", 14, Color("99b9a6")))
	_modal_title = _text("Station de contrôle", 34)
	modal_column.add_child(_modal_title)
	_modal_body = _text("", 18, Color("c1d1ca"))
	modal_column.add_child(_modal_body)
	_primary = _button("Commencer", _primary_action)
	modal_column.add_child(_primary)
	_secondary = _button("Recommencer la traversée", _restart_action)
	modal_column.add_child(_secondary)


func _fit_ui() -> void:
	if not is_instance_valid(_ui):
		return
	var viewport_size: Vector2 = get_viewport().get_visible_rect().size
	var width: float = viewport_size.x
	var narrow: bool = width < 760
	_compact_hud = narrow or viewport_size.y < 560.0
	var hud_width := minf(440.0 if _compact_hud else 610.0, width - 40.0)
	_hud.size.x = hud_width
	_hud_panel.custom_minimum_size.x = hud_width
	_cards.visible = not _compact_hud
	_compact_progress.visible = _compact_hud
	_toast.visible = _toast_left > 0.0 and not _compact_hud
	_hud_title.add_theme_font_size_override("font_size", 14 if _compact_hud else 18)
	_clock.add_theme_font_size_override("font_size", 14 if _compact_hud else 16)
	_objective.add_theme_font_size_override("font_size", 16 if _compact_hud else 18)
	_modal_panel.custom_minimum_size.x = minf(600.0, width - 40.0)
	_action_panel.offset_left = -minf(210.0, width * 0.38)
	_action_panel.offset_right = minf(210.0, width * 0.38)
	_interact_button.text = "Examiner" if narrow else "Examiner · E"
	_pause_button.text = "Pause" if narrow else "Pause · P"
	_interact_button.add_theme_font_size_override("font_size", 16 if narrow else 18)
	_pause_button.add_theme_font_size_override("font_size", 16 if narrow else 18)
	_modal_title.add_theme_font_size_override("font_size", 28 if narrow else 34)
	_modal_body.add_theme_font_size_override("font_size", 16 if narrow else 18)
	if narrow and not _started:
		_modal_body.text = "Explorez le sas, la galerie et les archives. Prenez le badge, choisissez un relais et restaurez l’index pour valider la sortie.\n\nTactile : glisser à gauche pour marcher, à droite pour regarder.\n\nClavier : ZQSD / WASD, flèches pour regarder, E pour examiner, P pour la pause."
	_refresh_progress()
	_queue_hud_fit()


func _queue_hud_fit() -> void:
	if _hud_fit_pending:
		return
	_hud_fit_pending = true
	_shrink_hud.call_deferred()


func _shrink_hud() -> void:
	# Autowrap's minimum height settles after its assigned width. Containers
	# otherwise retain an earlier tall rect even when their minimum shrinks.
	for pass_index in range(3):
		await get_tree().process_frame
		if not is_instance_valid(_hud):
			return
		_hud_panel.reset_size()
		_hud.reset_size()
	_hud_fit_pending = false


func _refresh_progress() -> void:
	var titles: Array[String] = ["01 · BADGE", "02 · RELAIS", "03 · INDEX", "04 · SORTIE"]
	for i in range(4):
		var complete: bool = _stage > i or (_finished and i == 3)
		var current: bool = _stage == i and not _finished
		var status: String = "VALIDÉ" if complete else ("EN COURS" if current else "EN ATTENTE")
		_card_labels[i].text = titles[i] + "\n" + status
		var bg := Color("203f37") if complete else (Color("274747") if current else Color("182d32"))
		_card_panels[i].add_theme_stylebox_override("panel", _style(bg, Color("649d82") if complete or current else Color("304a4d"), 8))
	match _stage:
		0: _objective.text = "SAS · Badge au pupitre gauche." if _compact_hud else "SAS · Prenez le badge sur le pupitre de gauche."
		1: _objective.text = "GALERIE · Choisissez un relais." if _compact_hud else "GALERIE · Choisissez stabilité ou économie."
		2: _objective.text = "ARCHIVES · Restaurez l’index." if _compact_hud else "ARCHIVES · Restaurez l’index avec un classement."
		3: _objective.text = "SORTIE · Pupitre au fond." if _compact_hud else "ARCHIVES · Validez la sortie au pupitre du fond."
		_: _objective.text = "Tous les objectifs sont validés."
	var step_labels: Array[String] = ["BADGE", "RELAIS", "INDEX", "SORTIE"]
	_compact_progress.text = "ÉTAPE %d/4 · %s" % [mini(_stage + 1, 4), step_labels[mini(_stage, 3)]] if not _finished else "4/4 · ACCÈS VALIDÉ"
	if _workshop_stage == 2:
		_workshop_note.text = "Atelier · Diagnostic complet"
	elif _workshop_stage == 1:
		_workshop_note.text = "Option · Atelier : vérifiez le témoin."
	elif _stage >= 2:
		_workshop_note.text = "Option · Atelier à droite : registre."
	else:
		_workshop_note.text = "Option · Atelier après le relais."
	_queue_hud_fit()


func _show_toast(text: String, duration: float = 4.5) -> void:
	_toast.text = text
	_toast_left = duration
	_toast.visible = not _compact_hud
	_queue_hud_fit()


func _primary_action() -> void:
	if _finished:
		_reset_run(true)
	elif not _started:
		_started = true
		_paused = false
		_set_modal(false)
		_emit_web("started")
		_show_toast("Badge à gauche, plan à droite. Approchez et regardez un écran ; E ou Examiner pour agir.", 7.0)
	else:
		_paused = false
		_set_modal(false)
		_emit_web("resumed")


func _restart_action() -> void:
	_reset_run(true)


func _show_plan() -> void:
	_paused = true
	_modal_title.text = "Plan de station"
	_modal_body.text = "Badge → Relais → Index → Sortie.\n\nOption : après le relais, baie à droite vers l’atelier. Relevez le registre, puis vérifiez le témoin pour ouvrir son passage vers les archives.\n\nVous pouvez terminer sans ce détour."
	_primary.text = "Reprendre"
	_secondary.visible = false
	_set_modal(true)
	_emit_web("paused")


func _toggle_pause() -> void:
	if not _started or _finished:
		return
	var frame: int = Engine.get_process_frames()
	if frame == _last_pause_frame:
		return
	_last_pause_frame = frame
	_paused = not _paused
	if _paused:
		_modal_title.text = "Traversée en pause"
		_modal_body.text = "Votre progression est conservée.\n\nReprenez la visite ou recommencez avec les portes et les choix remis à zéro."
		_primary.text = "Reprendre"
		_secondary.visible = true
	_set_modal(_paused)
	_emit_web("paused" if _paused else "resumed")


func _set_modal(visible: bool) -> void:
	_modal.visible = visible
	_hud.visible = not visible
	_action_panel.visible = not visible
	_reticle.visible = not visible
	_player.set_controls_enabled(not visible)
	if visible:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		_primary.grab_focus()
	else:
		_primary.release_focus()
		_secondary.release_focus()
		_interact_button.release_focus()
		_pause_button.release_focus()
		_queue_hud_fit()


func _reset_run(begin: bool) -> void:
	for tween in _gate_tweens:
		if is_instance_valid(tween):
			tween.kill()
	_gate_tweens.clear()
	_stage = 0
	_relay_choice = ""
	_index_choice = ""
	_workshop_stage = 0
	_elapsed = 0.0
	_started = begin
	_paused = false
	_finished = false
	_focus_id = ""
	_toast_left = 0.0
	_toast.visible = false
	_clock.text = "00:00"
	_player.reset_pose(Vector3(0.0, 0.04, -1.8))
	for gate in _gates:
		gate["opened"] = false
		var body: StaticBody3D = gate["body"]
		body.position.y = 1.36
		var collision: CollisionShape3D = gate["collision"]
		collision.set_deferred("disabled", false)
		var label: Label3D = gate["label"]
		label.text = str(gate["closed_text"])
		label.modulate = Color("e3eee8")
	for terminal in _terminals:
		var node: Node3D = terminal["node"]
		var light := node.get_node_or_null("RelayGlow") as OmniLight3D
		if light != null:
			light.light_energy = 0.0
	_refresh_progress()
	_refresh_terminals()
	_modal_title.text = "Station de contrôle"
	_modal_body.text = "Rétablissez l’accès d’une station en trois espaces : sas, galerie et archives. Prenez le badge, choisissez un relais, restaurez l’index puis validez la sortie.\n\nZQSD / WASD : se déplacer · Flèches : regarder\nSouris : regarder · E : examiner · P / Échap : pause\nTactile : glisser à gauche pour marcher, à droite pour regarder ; boutons au centre."
	_primary.text = "Commencer"
	_secondary.visible = false
	_set_modal(not begin)
	_fit_ui()
	if begin:
		_emit_web("restarted")
		_show_toast("Nouvelle traversée. Le badge vous attend dans le sas.", 5.0)


func _finish_run() -> void:
	_finished = true
	_stage = 4
	_refresh_progress()
	_refresh_terminals()
	_modal_title.text = "Sortie validée"
	var workshop_result: String = "diagnostic complet" if _workshop_stage == 2 else ("registre relevé, témoin non vérifié" if _workshop_stage == 1 else "détour non effectué")
	_modal_body.text = "La station a retrouvé son accès.\n\nRelais : %s\nIndex restauré : %s\nAtelier facultatif : %s\nTemps de visite : %s\n\nRejouer réinitialise toute la traversée." % [_relay_choice, _index_choice, workshop_result, _format_time(_elapsed)]
	_primary.text = "Rejouer"
	_secondary.visible = false
	_set_modal(true)
	_emit_web("finished", "sortie-validee")


func _emit_web(event_type: String, value: String = "") -> void:
	if not OS.has_feature("web"):
		return
	var data: Dictionary = {"channel": "jigsaw-station", "type": event_type}
	if event_type == "finished":
		data["issue"] = value
	elif event_type == "progress":
		data["stage"] = value
	JavaScriptBridge.eval("window.parent.postMessage(%s, location.origin)" % JSON.stringify(data))


func _format_time(seconds: float) -> String:
	var whole: int = int(seconds)
	return "%02d:%02d" % [whole / 60, whole % 60]
