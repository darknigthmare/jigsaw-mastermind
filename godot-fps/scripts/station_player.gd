extends CharacterBody3D

signal interaction_requested
signal pause_requested

const SPEED := 3.3
const EYE_HEIGHT := 1.62
const MOUSE_SENSITIVITY := 0.0024
const TOUCH_SENSITIVITY := 0.004
const TOUCH_RADIUS := 64.0
const KEY_LOOK_SPEED := 1.7

var look_camera: Camera3D
var _controls_enabled := false
var _pitch := 0.0
var _move_touch := -1
var _look_touch := -1
var _move_origin := Vector2.ZERO
var _move_axis := Vector2.ZERO

func _ready() -> void:
	var collider := CollisionShape3D.new()
	var capsule := CapsuleShape3D.new()
	capsule.radius = 0.28
	capsule.height = 1.72
	collider.shape = capsule
	collider.position.y = capsule.height * 0.5
	add_child(collider)

	look_camera = Camera3D.new()
	look_camera.position.y = EYE_HEIGHT
	look_camera.fov = 76.0
	look_camera.near = 0.05
	look_camera.far = 65.0
	add_child(look_camera)
	look_camera.make_current()

func set_controls_enabled(enabled: bool) -> void:
	_controls_enabled = enabled
	_move_touch = -1
	_look_touch = -1
	_move_axis = Vector2.ZERO
	velocity = Vector3.ZERO
	if enabled and not _is_touch_screen():
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	else:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE

func reset_pose(at: Vector3) -> void:
	position = at
	rotation = Vector3.ZERO
	_pitch = 0.0
	look_camera.rotation = Vector3.ZERO
	velocity = Vector3.ZERO

func _physics_process(delta: float) -> void:
	var movement := Vector2.ZERO
	if _controls_enabled:
		movement = Input.get_vector("move_left", "move_right", "move_forward", "move_back")
		movement = (movement + _move_axis).limit_length()
		var keyboard_look := Input.get_vector("look_left", "look_right", "look_up", "look_down")
		_turn(keyboard_look * KEY_LOOK_SPEED * delta)

	var world_movement := basis * Vector3(movement.x, 0, movement.y)
	velocity.x = world_movement.x * SPEED
	velocity.z = world_movement.z * SPEED
	if not is_on_floor():
		velocity.y -= 18.0 * delta
	move_and_slide()

func _unhandled_input(event: InputEvent) -> void:
	if _controls_enabled and event.is_action_pressed("station_pause") and not event.is_echo():
		pause_requested.emit()
		get_viewport().set_input_as_handled()
		return
	if not _controls_enabled:
		return

	if event.is_action_pressed("station_interact") and not event.is_echo():
		interaction_requested.emit()
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		if not _is_touch_screen() and Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	elif event is InputEventScreenTouch:
		_track_touch(event)
	elif event is InputEventScreenDrag:
		if event.index == _move_touch:
			_move_axis = ((event.position - _move_origin) / TOUCH_RADIUS).limit_length()
		elif event.index == _look_touch:
			_turn(event.relative * TOUCH_SENSITIVITY)

func _input(event: InputEvent) -> void:
	# A captured cursor keeps its last position. The HUD can consume motion when
	# that position is over a button, so FPS look must run before GUI dispatch.
	if _controls_enabled and event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		_turn(event.screen_relative * MOUSE_SENSITIVITY)
		get_viewport().set_input_as_handled()
		return
	# A finger released over the GUI may not reach _unhandled_input.
	if event is InputEventScreenTouch and not event.pressed:
		_track_touch(event)

func _track_touch(event: InputEventScreenTouch) -> void:
	if not event.pressed:
		if event.index == _move_touch:
			_move_touch = -1
			_move_axis = Vector2.ZERO
		if event.index == _look_touch:
			_look_touch = -1
	elif event.position.x < get_viewport().get_visible_rect().size.x * 0.5:
		if _move_touch == -1:
			_move_touch = event.index
			_move_origin = event.position
	elif _look_touch == -1:
		_look_touch = event.index

func _turn(amount: Vector2) -> void:
	rotation.y = wrapf(rotation.y - amount.x, -PI, PI)
	_pitch = clampf(_pitch - amount.y, -1.35, 1.35)
	look_camera.rotation.x = _pitch

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT and _controls_enabled:
		pause_requested.emit()

func _is_touch_screen() -> bool:
	return DisplayServer.is_touchscreen_available()
