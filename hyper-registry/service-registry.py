#!/usr/bin/env python3
# =============================================================================
# DYNAMIC SERVICE REGISTRY & AUTO-DISCOVERY v1.0
# Universal plugin/sidecar/mesh registry for CLI module auto-injection
# =============================================================================

from typing import Type, Dict, Any, Callable, List
from pydantic import BaseModel
import importlib.util, os, sys, traceback

PLUGIN_FOLDER = "./modules"  # Drop-in directory for hot plugins

class ServiceDescriptor(BaseModel):
    """Model describing a dynamically loaded service/plugin."""
    name: str
    module: str
    version: str = "1.0"
    description: str = ""
    register_fn: Optional[Callable[[Any], None]] = None

class ServiceRegistry(BaseModel):
    """Central registry for CLI services/plugins/modules. Singleton pattern."""
    services: Dict[str, ServiceDescriptor] = {}

    def discover_modules(self, folder: str = PLUGIN_FOLDER) -> None:
        """Discover and register all modules in the given folder."""
        for fname in os.listdir(folder):
            if not fname.endswith(".py") or fname.startswith("_"):
                continue
            try:
                path = os.path.join(folder, fname)
                spec = importlib.util.spec_from_file_location(fname[:-3], path)
                mod = importlib.util.module_from_spec(spec)
                sys.modules[fname[:-3]] = mod
                spec.loader.exec_module(mod)  # type: ignore
                if hasattr(mod, "register"):
                    mod.register(self)
            except Exception as e:
                print(f"❌ Error loading {fname}: {e}")
                traceback.print_exc()

    def register_service(self, name: str, module: str, version: str = "1.0", description: str = "", register_fn: Callable = None) -> None:
        """Register a new service plugin with the registry."""
        if name in self.services:
            return
        self.services[name] = ServiceDescriptor(name=name, module=module, version=version, description=description, register_fn=register_fn)

    def get_service(self, name: str) -> ServiceDescriptor:
        return self.services[name]

    def all_services(self) -> List[ServiceDescriptor]:
        return list(self.services.values())

# SINGLETON INSTANCE & AUTO-DISCOVERY
REGISTRY = ServiceRegistry()
REGISTRY.discover_modules()

# UNIVERSAL CONTEXT/ML/SIDECAR INJECTION HOOKS
def inject_context(meta: dict): pass
def monitor_model_drift(events: list): pass

# SBOM
# pydantic==2.7.1

# TESTS (pytest)
def test_discovery_and_registration(tmp_path):
    mods = tmp_path / "modules"
    mods.mkdir()
    foo = mods / "foo_service.py"
    foo.write_text("""
def register(registry):
    registry.register_service('Foo','foo_service')
""")
    reg = ServiceRegistry()
    reg.discover_modules(str(mods))
    assert 'Foo' in reg.services

def test_registry_get_set():
    reg = ServiceRegistry()
    reg.register_service("Bar", "bar_module", "2.1", "desc")
    s = reg.get_service("Bar")
    assert s.name == "Bar" and s.version == "2.1"

# Mermaid diagram:
'''
```mermaid
classDiagram
    class ServiceRegistry {
        +register_service()
        +discover_modules()
        +get_service()
        +all_services()
    }
    class ServiceDescriptor {
        name
        module
        version
        description
        register_fn
    }
    class DYNAMIC_PLUGIN
    ServiceRegistry "1" *-- "many" ServiceDescriptor
    DYNAMIC_PLUGIN <|-- ServiceDescriptor : "register()"
```
'''