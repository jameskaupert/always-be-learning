extends CharacterBody3D
class_name Enemy

@export var max_health: float = 20.0

@onready var rig: Rig = $Rig
@onready var health_component: HealthComponent = $HealthComponent

func _ready() -> void:
	rig.set_active_mesh(
		rig.villager_meshes.pick_random()
	)
	
	health_component.update_max_health(max_health)


func _on_health_component_defeat() -> void:
	rig.travel("Defeat")
	
