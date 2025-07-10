extends CharacterBody3D

@onready var rig: Rig = $Rig

func _ready() -> void:
	rig.set_active_mesh(
		rig.villager_meshes.pick_random()
	)
