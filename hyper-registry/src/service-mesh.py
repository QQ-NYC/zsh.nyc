#!/usr/bin/env python3
# =============================================================================
# MICRO SERVICES CODE INJECTION SERVICE MESH v∞+1.0
# Universal Hyper Registry Service Mesh with Istio/Consul Integration
# Auto-detection, bidirectional propagations, auto registrations, auto search/discovery
# =============================================================================

import consul
import requests
import json
import os
import time
from typing import Dict, List, Any, Optional
import threading
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ServiceMeshManager:
    """Enterprise-grade service mesh manager with Istio/Consul integration."""

    def __init__(self, consul_host: str = "localhost", consul_port: int = 8500,
                 istio_gateway: str = "localhost:15001"):
        self.consul = consul.Consul(host=consul_host, port=consul_port)
        self.istio_gateway = istio_gateway
        self.services: Dict[str, Dict[str, Any]] = {}
        self.discovery_thread = None
        self.running = False

    def start_auto_discovery(self):
        """Start automatic service discovery and registration."""
        self.running = True
        self.discovery_thread = threading.Thread(target=self._discovery_loop)
        self.discovery_thread.daemon = True
        self.discovery_thread.start()
        logger.info("🔍 Auto-discovery started")

    def stop_auto_discovery(self):
        """Stop automatic service discovery."""
        self.running = False
        if self.discovery_thread:
            self.discovery_thread.join()
        logger.info("🔍 Auto-discovery stopped")

    def _discovery_loop(self):
        """Main discovery loop with bidirectional propagation."""
        while self.running:
            try:
                self._discover_consul_services()
                self._discover_istio_services()
                self._propagate_registrations()
                time.sleep(30)  # Discovery interval
            except Exception as e:
                logger.error(f"Discovery error: {e}")

    def _discover_consul_services(self):
        """Discover services from Consul."""
        try:
            services = self.consul.catalog.services()[1]
            for service_name, tags in services.items():
                instances = self.consul.catalog.service(service_name)[1]
                for instance in instances:
                    service_id = f"consul-{instance['ServiceID']}"
                    self.services[service_id] = {
                        'name': service_name,
                        'address': instance['ServiceAddress'] or instance['Address'],
                        'port': instance['ServicePort'],
                        'tags': tags,
                        'source': 'consul',
                        'health': self._check_health(instance)
                    }
        except Exception as e:
            logger.warning(f"Consul discovery failed: {e}")

    def _discover_istio_services(self):
        """Discover services from Istio service registry."""
        try:
            # Query Istio Pilot for service endpoints
            response = requests.get(f"http://{self.istio_gateway}/debug/registryz", timeout=5)
            if response.status_code == 200:
                registry = json.loads(response.text)
                for service in registry.get('services', []):
                    service_id = f"istio-{service['name']}"
                    self.services[service_id] = {
                        'name': service['name'],
                        'address': service.get('address', 'unknown'),
                        'port': service.get('port', 0),
                        'tags': service.get('labels', {}),
                        'source': 'istio',
                        'health': 'unknown'  # Istio health checks
                    }
        except Exception as e:
            logger.warning(f"Istio discovery failed: {e}")

    def _check_health(self, instance: Dict[str, Any]) -> str:
        """Check service health via Consul."""
        try:
            health = self.consul.health.service(instance['ServiceName'],
                                              instance['ServiceID'])[1]
            return 'passing' if health else 'failing'
        except:
            return 'unknown'

    def _propagate_registrations(self):
        """Bidirectional propagation of service registrations."""
        # Propagate to Consul
        for service_id, service in self.services.items():
            if service['source'] != 'consul':
                self._register_to_consul(service)

        # Propagate to Istio (via annotations or sidecar injection)
        # This would typically involve Kubernetes API calls
        pass

    def _register_to_consul(self, service: Dict[str, Any]):
        """Register service to Consul."""
        try:
            self.consul.agent.service.register(
                name=service['name'],
                service_id=f"hyper-{service['name']}",
                address=service['address'],
                port=service['port'],
                tags=['hyper-registry', 'auto-registered']
            )
            logger.info(f"📝 Registered {service['name']} to Consul")
        except Exception as e:
            logger.error(f"Failed to register {service['name']}: {e}")

    def register_service(self, name: str, address: str, port: int,
                        tags: List[str] = None, metadata: Dict[str, Any] = None):
        """Manually register a service."""
        service_id = f"manual-{name}-{port}"
        self.services[service_id] = {
            'name': name,
            'address': address,
            'port': port,
            'tags': tags or [],
            'metadata': metadata or {},
            'source': 'manual',
            'health': 'unknown'
        }
        self._register_to_consul(self.services[service_id])
        logger.info(f"✅ Service {name} registered")

    def search_services(self, query: str) -> List[Dict[str, Any]]:
        """Search services by name, tags, or metadata."""
        results = []
        query_lower = query.lower()
        for service in self.services.values():
            if (query_lower in service['name'].lower() or
                any(query_lower in tag.lower() for tag in service.get('tags', [])) or
                any(query_lower in str(v).lower() for v in service.get('metadata', {}).values())):
                results.append(service)
        return results

    def inject_code(self, service_name: str, code: str):
        """Code injection into service mesh (for dynamic updates)."""
        # This is a conceptual implementation
        # In reality, would use service mesh sidecar injection
        logger.info(f"💉 Code injection into {service_name}: {code[:50]}...")

    def get_service_mesh_status(self) -> Dict[str, Any]:
        """Get comprehensive service mesh status."""
        return {
            'total_services': len(self.services),
            'sources': list(set(s['source'] for s in self.services.values())),
            'healthy_services': sum(1 for s in self.services.values() if s.get('health') == 'passing'),
            'mesh_topology': self._build_topology()
        }

    def _build_topology(self) -> Dict[str, List[str]]:
        """Build service dependency topology."""
        topology = {}
        for service in self.services.values():
            deps = service.get('metadata', {}).get('dependencies', [])
            topology[service['name']] = deps
        return topology

# Singleton instance
mesh_manager = ServiceMeshManager()

if __name__ == "__main__":
    # Example usage
    mesh_manager.start_auto_discovery()

    # Register a service
    mesh_manager.register_service("hyper-registry", "localhost", 8080,
                                 tags=["registry", "hyper"], metadata={"version": "1.0"})

    # Search
    results = mesh_manager.search_services("registry")
    print(f"Found services: {[r['name'] for r in results]}")

    # Keep running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        mesh_manager.stop_auto_discovery()